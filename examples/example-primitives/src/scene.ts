import createRegl from 'regl'
import { start } from '@thi.ng/hdom'
import { canvasWebGL, adaptDPI } from '@thi.ng/hdom-components/canvas'
import { hasWebGL } from '@thi.ng/checks'
import {
  createFrameCatch,
  createBasicMesh,
  PropsBasicMaterial,
  createDrawMeshWireframe,
} from '@tstackgl/regl-draw'
import { Mesh, Vec3 } from '@tstackgl/types'
import createCamera from 'regl-camera' // TODO: remove dependency
import createQuad from 'primitive-quad'
import createBox from 'geo-3d-box'
import createIcosphere from 'primitive-icosphere'
import createSphere from 'primitive-sphere'
import createCapsule from 'primitive-capsule'
import createTorus from 'primitive-torus'
import bunny from 'bunny'
import teapot from 'teapot'
import dragon from 'stanford-dragon/4'
import * as tx from '@thi.ng/transducers'
import mat4 from 'gl-mat4'
import { createIcosahedron, createCylinder, createOctahedron } from '@tstackgl/geometry'
import { createNormalMesh } from '@tstackgl/regl-draw/src/draw-normal-mesh'
import { guiState, DrawMode, guiActions } from './gui-state'

let loop = { cancel: function() {} }

export function createReglScene() {
  // canvas init hook
  const init = (canvas: HTMLCanvasElement, __: WebGLRenderingContext) => {
    const width = canvas.parentElement ? canvas.parentElement.clientWidth : window.innerHeight
    const height = canvas.parentElement ? canvas.parentElement.clientHeight : window.innerHeight

    adaptDPI(canvas, width, height)

    const regl = createRegl({ canvas, extensions: ['OES_standard_derivatives'] })
    const frameCatch = createFrameCatch(regl)
    const camera = createCamera(regl, { distance: 65, phi: 0.4, theta: 1.2 })

    const meshes: Array<{ mesh: Mesh; scale: Vec3 }> = [
      { scale: [1, 1, 1], mesh: createQuad(2) },
      { scale: [1, 1, 1], mesh: createBox({ size: 4, segments: 2 }) },
      { scale: [1, 1, 1], mesh: createSphere(2, { segments: 5 }) },
      { scale: [1, 1, 1], mesh: createIcosphere(2, { subdivisions: 1 }) },
      { scale: [1, 1, 1], mesh: createIcosahedron(2) },
      { scale: [1, 1, 1], mesh: createOctahedron(2) },
      { scale: [1, 1, 1], mesh: createCylinder(2, 2, 4, 8, 4) },
      { scale: [1, 1, 1], mesh: createCapsule(2, 2, 8) },
      {
        scale: [1, 1, 1],
        mesh: createTorus({ majorRadius: 2, minorSegments: 8, majorSegments: 18 }),
      },
      { scale: [0.4, 0.4, 0.4], mesh: bunny },
      { scale: [0.2, 0.2, 0.2], mesh: teapot },
      { scale: [0.06, 0.06, 0.06], mesh: dragon },
    ]

    const numRow = 3
    const xform = tx.comp(
      tx.mapIndexed((i: number, x: { mesh: Mesh; scale: Vec3 }) => {
        const { scale } = x
        const translating = mat4.fromTranslation(mat4.create(), [
          15 - Math.floor(i / numRow) * 10,
          0,
          (i % numRow) * 10,
        ])
        const scaling = mat4.fromScaling(mat4.create(), scale)

        const model = mat4.create()
        mat4.multiply(model, model, translating)
        mat4.multiply(model, model, scaling)

        if (i === meshes.length - 1) {
          console.log('dragon!')
          mat4.multiply(model, model, mat4.fromTranslation(mat4.create(), [0, -60, 0]))
        }

        return {
          model,
          diffuseColor: [0.4, 0.4, 0.4] as Vec3,
          ambientColor: [0.1, 0.1, 0.1] as Vec3,
          lightDirection: [-1.0 / Math.sqrt(3), 1.0 / Math.sqrt(3), 1.0 / Math.sqrt(3)] as Vec3,
        } as PropsBasicMaterial
      }),
    )
    const props = [...tx.iterator1(xform, meshes)]

    const drawCommands = meshes.map(({ mesh }) => createBasicMesh(regl, mesh))
    const drawWireframes = meshes.map(({ mesh }) => createDrawMeshWireframe(regl, mesh))
    const drawNormals = meshes.map(({ mesh }) => createNormalMesh(regl, mesh))

    loop = frameCatch(function({}) {
      camera((cameraState: any) => {
        if (!cameraState.dirty && !guiState.dirty) {
          return
        }
        guiState.dirty = false
        console.log('draw loop')

        regl.clear({ color: [0.1, 0.1, 0.1, 1] })

        switch (guiState.drawMode) {
          case 'normals':
            drawNormals.forEach((drawCommand, i) => {
              drawCommand.draw({
                model: props[i].model,
              })
            })
            break
          case 'wireframes':
            drawWireframes.forEach((drawCommand, i) => {
              drawCommand.draw({
                model: props[i].model,
                color: [1, 1, 1],
              })
            })
            break
          case 'lights':
            drawCommands.forEach((drawCommand, i) => {
              drawCommand.draw(props[i])
            })
            break
          default:
            break
        }
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
