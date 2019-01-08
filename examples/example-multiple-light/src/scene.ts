import createRegl from 'regl'
import { adaptDPI } from '@thi.ng/hdom-components/canvas'
import { createFrameCatch, createXYZ, createDrawPointDebug } from '@tstackgl/regl-draw'
import { Mesh, Vec3 } from '@tstackgl/types'
import createCamera from 'regl-camera' // TODO: remove dependency
import createTorus from 'primitive-torus'
import * as tx from '@thi.ng/transducers'
import mat4 from 'gl-mat4'
import mat3 from 'gl-mat3'
import vec3 from 'gl-vec3'

import { createDrawUnicolor } from './draw-unicolor'
import { createDiffuseLambert, PropsDiffuseLambert } from './draw-diffuse-lambert'
import { createDrawMeshWireframe as createDrawWireframe } from './draw-wireframe'
import { createNormalMesh as createNormal } from './draw-normal'
import { createDiffuseOrenNayar, PropsDiffuseOrenNayar } from './draw-diffuse-oren-nayar'

let loop = { cancel: function() {} }

const lightPosition: Vec3 = [5, 5, 5]

export function createReglScene() {
  const init = (canvas: HTMLCanvasElement, __: WebGLRenderingContext) => {
    const width = canvas.parentElement ? canvas.parentElement.clientWidth : window.innerHeight
    const height = canvas.parentElement ? canvas.parentElement.clientHeight : window.innerHeight

    adaptDPI(canvas, width, height)

    const regl = createRegl({ canvas, extensions: ['OES_standard_derivatives'] })
    const frameCatch = createFrameCatch(regl)
    const camera = createCamera(regl, { distance: 25, phi: 0.4, theta: 1.2 })
    const axes = createXYZ(regl, 10)
    const lightDebugPoint = createDrawPointDebug(regl, 0.5)

    const mesh: Mesh = createTorus()

    type CreateCommand<T> = (
      regl: createRegl.Regl,
      mesh: Mesh,
    ) => { draw: createRegl.DrawCommand<createRegl.DefaultContext, T> }

    const lambertProps: PropsDiffuseLambert = {
      diffuseColor: [0.4, 0.4, 0.4],
      ambientColor: [0.08, 0.08, 0.08],
      lightPosition: lightPosition,
      model: mat4.create(),
      normalMatrix: mat3.create(),
    }

    const orenNayar: PropsDiffuseOrenNayar = {
      diffuseColor: [0.4, 0.4, 0.4],
      ambientColor: [0.08, 0.08, 0.08],
      lightPosition: lightPosition,

      roughness: 0.3,
      albedo: 0.9,
      eyePosition: vec3.create(),
      model: mat4.create(),
      normalMatrix: mat3.create(),
    }

    const createCommandAndLight: Array<{ create: CreateCommand<any>; lightProps: {} }> = [
      { create: createDrawUnicolor, lightProps: { color: [1, 0.4, 0.0] } },
      { create: createDrawWireframe, lightProps: { color: [0.8, 0.8, 0.8] } },
      { create: createNormal, lightProps: {} },
      {
        create: createDiffuseLambert,
        lightProps: orenNayar,
      },
      {
        create: createDiffuseOrenNayar,
        lightProps: orenNayar,
      },
    ]

    const numRow = 3
    const xform = tx.comp(
      tx.mapIndexed((i: number, { create, lightProps }) => {
        const model = mat4.create()
        const translation: Vec3 = [5 - Math.floor(i / numRow) * 5, 0, 5 - (i % numRow) * 5]
        console.log({ translation })
        mat4.translate(model, model, translation)
        return { model, drawCommand: create(regl, mesh), lightProps }
      }),
    )
    const commandsAndProps = [...tx.iterator1(xform, createCommandAndLight)]

    const modelViewMatrix = mat4.create()
    const normalMatrix = mat3.create()
    const inverseModelViewMatrix = mat4.create()

    loop = frameCatch(function({}) {
      camera((cameraState: any) => {
        if (!cameraState.dirty) {
          return
        }
        console.log('draw loop')

        console.log({ cameraState })

        regl.clear({ color: [0.1, 0.1, 0.1, 1] })

        axes.draw()

        lightDebugPoint.draw({
          color: [1, 1, 0],
          translate: lightPosition,
        })

        commandsAndProps.forEach(({ drawCommand, model, lightProps }, i) => {
          mat4.multiply(modelViewMatrix, cameraState.view, model)
          mat4.invert(inverseModelViewMatrix, modelViewMatrix)
          mat3.fromMat4(normalMatrix, inverseModelViewMatrix)
          mat3.transpose(normalMatrix, normalMatrix)

          const props = { ...lightProps, model, normalMatrix, eyePosition: cameraState.eye }
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
