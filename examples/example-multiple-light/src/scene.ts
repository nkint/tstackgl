import createRegl from 'regl'
import { adaptDPI } from '@thi.ng/hdom-components/canvas'
import { createFrameCatch, createXYZ, createDrawPointDebug } from '@tstackgl/regl-draw'
import { Mesh, Vec3 } from '@tstackgl/types'
import createCamera from 'regl-camera' // TODO: remove dependency
import createTorus from 'primitive-torus'
import * as tx from '@thi.ng/transducers'
import mat4 from 'gl-mat4'
import mat3 from 'gl-mat3'
import { lightPosition, color } from './state'
import { createDrawMeshWireframe as createDrawWireframe } from './draw-wireframe'
import { createCommandAndProps } from './materials'

let loop = { cancel: function() {} }

export function createReglScene() {
  const init = (canvas: HTMLCanvasElement, __: WebGLRenderingContext) => {
    const width = canvas.parentElement ? canvas.parentElement.clientWidth : window.innerHeight
    const height = canvas.parentElement ? canvas.parentElement.clientHeight : window.innerHeight

    adaptDPI(canvas, width, height)

    const regl = createRegl({ canvas, extensions: ['OES_standard_derivatives'] })
    const frameCatch = createFrameCatch(regl)
    const camera = createCamera(regl, { distance: 25, phi: 0.4, theta: 1.2 })
    const axes = createXYZ(regl, 10)
    const lightDebugPoint = createDrawPointDebug(regl, 0.2)

    const mesh: Mesh = createTorus()

    const numRow = 3
    const xform = tx.comp(
      tx.mapIndexed((i: number, { create, props }) => {
        const model = mat4.create()
        const translation: Vec3 = [5 - Math.floor(i / numRow) * 5, 0, 5 - (i % numRow) * 5]
        mat4.translate(model, model, translation)
        return { model, drawCommand: create(regl, mesh), props }
      }),
    )
    const commandsAndProps = [...tx.iterator1(xform, createCommandAndProps)]

    const modelViewMatrix = mat4.create()
    const normalMatrix = mat3.create()
    const inverseModelViewMatrix = mat4.create()

    loop = frameCatch(function({}) {
      camera((cameraState: any) => {
        // if (!cameraState.dirty) {
        //   return
        // }
        // console.log('draw loop')
        // console.log({ cameraState })

        regl.clear({ color: [0.1, 0.1, 0.1, 1] })

        axes.draw()

        lightDebugPoint.draw({
          color: [1, 1, 0],
          translate: lightPosition,
        })

        commandsAndProps.forEach(({ drawCommand, model, props }, i) => {
          mat4.multiply(modelViewMatrix, cameraState.view, model)
          mat4.invert(inverseModelViewMatrix, modelViewMatrix)
          mat3.fromMat4(normalMatrix, inverseModelViewMatrix)
          mat3.transpose(normalMatrix, normalMatrix)

          props.model = model
          props.normalMatrix = normalMatrix
          props.eyePosition = cameraState.eye

          drawCommand.draw(props)
        })
      })
    })
  }

  const update = () => {}

  return { init, update }
}

if ((module as any).hot) {
  ;(module as any).hot.dispose(() => {
    loop.cancel()
  })
}
