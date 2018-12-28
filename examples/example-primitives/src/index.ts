import createRegl from 'regl'
import { start } from '@thi.ng/hdom'
import { canvasWebGL, adaptDPI } from '@thi.ng/hdom-components/canvas'
import { hasWebGL } from '@thi.ng/checks'
import { createFrameCatch } from '@tstackgl/regl-draw'
import { createBasicMesh, PropsBasicMaterial } from './draw-basic-mesh'
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
import * as tx from '@thi.ng/transducers'

let loop = { cancel: function() {} }

// TODO: add createCheckerTexture from https://github.com/glo-js/glo-demo-primitive/blob/master/index.js

function createReglScene() {
  // canvas init hook
  const init = (canvas: HTMLCanvasElement, __: WebGLRenderingContext) => {
    const width = canvas.parentElement ? canvas.parentElement.clientWidth : window.innerHeight
    const height = canvas.parentElement ? canvas.parentElement.clientHeight : window.innerHeight

    adaptDPI(canvas, width, height)

    const regl = createRegl({ canvas, extensions: ['OES_standard_derivatives'] })
    const frameCatch = createFrameCatch(regl)
    const camera = createCamera(regl, { distance: 65, phi: 0.4, theta: 1.2 })

    const meshes: Array<Mesh> = [
      createQuad(2),
      createBox({ size: 4, segments: 2 }),
      createSphere(2, { segments: 5 }),
      createIcosphere(2, { subdivisions: 1 }),
      createCapsule(2, 2, 8),
      createTorus({ majorRadius: 2, minorSegments: 8, majorSegments: 18 }),
      bunny,
      teapot,
    ]

    const lightProps = {
      diffuseColor: [0.4, 0.4, 0.4] as Vec3,
      ambientColor: [0.1, 0.1, 0.1] as Vec3,
      lightDirection: [-1.0 / Math.sqrt(3), 1.0 / Math.sqrt(3), 1.0 / Math.sqrt(3)] as Vec3,
    }
    const numRow = 2
    const indexes = [...tx.range(meshes.length)]
    const xform = tx.comp(
      tx.map(
        ([x, i]: [Mesh, number]): PropsBasicMaterial => {
          return {
            translate: [15 - Math.floor(i / numRow) * 10, 0, (i % numRow) * 10] as Vec3,
            scale:
              i < meshes.length - 2
                ? [1, 1, 1]
                : i < meshes.length - 1
                ? [0.4, 0.4, 0.4]
                : [0.2, 0.2, 0.2],
            ...lightProps,
          }
        },
      ),
    )

    const drawCommands = meshes.map(mesh => createBasicMesh(regl, mesh))

    loop = frameCatch(function({}) {
      camera((cameraState: any) => {
        if (!cameraState.dirty) {
          return
        }

        regl.clear({ color: [0, 0, 0, 1] })

        const props = [...tx.iterator1(xform, tx.tuples(meshes, indexes))]
        drawCommands.forEach((drawCommand, i) => {
          drawCommand.draw({
            ...props[i],
          } as PropsBasicMaterial)
        })
      })
    })
  }

  const update = () => {}
  return { init, update }
}

const app = () => {
  console.log('app')

  if (!hasWebGL()) {
    return ['p', 'Your browser does not support WebGL :- (']
  }

  const canvas = canvasWebGL(createReglScene())

  return [
    'div.h-100.flex.flex-column',
    ['p.ma0.pa2.code', 'mesh primitives'],
    ['div.h-100', [canvas, 200, 0.025]],
  ]
}

start(app())

if ((module as any).hot) {
  ;(module as any).hot.dispose(() => {
    loop.cancel()
  })
}
