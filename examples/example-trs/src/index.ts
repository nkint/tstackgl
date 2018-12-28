import createRegl from 'regl'
import { start } from '@thi.ng/hdom'
import { canvasWebGL, adaptDPI } from '@thi.ng/hdom-components/canvas'
import { hasWebGL } from '@thi.ng/checks'
import { createFrameCatch, createDrawPointDebug, createXYZ } from '@tstackgl/regl-draw'
import { Mesh, Vec3 } from '@tstackgl/types'
import createCamera from 'regl-camera'
import createIcosphere from 'primitive-icosphere'
import * as tx from '@thi.ng/transducers'
import { createDrawMeshWireframe } from './draw-mesh-wireframe'
import { getCentroidTriangle3 } from '@tstackgl/geometry'
import { createCylinder } from './primitive-cylinder'
import { createBasicMesh, PropsBasicMaterial } from './draw-basic-mesh'
import vec3 from 'gl-vec3'
import { pointTowardsMat } from './pointTowards'
import mat4 from 'gl-mat4'

let loop = { cancel: function() {} }

function createReglScene() {
  // canvas init hook
  const init = (canvas: HTMLCanvasElement, __: WebGLRenderingContext) => {
    const width = canvas.parentElement ? canvas.parentElement.clientWidth : window.innerHeight
    const height = canvas.parentElement ? canvas.parentElement.clientHeight : window.innerHeight

    adaptDPI(canvas, width, height)

    const regl = createRegl({ canvas, extensions: ['OES_standard_derivatives'] })
    const frameCatch = createFrameCatch(regl)
    const camera = createCamera(regl, { distance: 400, phi: 0.4, theta: 0 })
    const axis = createXYZ(regl, 150)

    const icosphere: Mesh = createIcosphere(100, { subdivisions: 1 })
    const cylinder: Mesh = createCylinder(20, 20, 200, 3)

    const drawIcosphere = createDrawMeshWireframe(regl, icosphere)
    const drawCylinder = createBasicMesh(regl, cylinder)
    const drawDebug = createDrawPointDebug(regl, 5)

    type Triangle3 = [Vec3, Vec3, Vec3]
    const triangle = icosphere.cells[23].map(index => icosphere.positions[index]) as Triangle3
    const centerTriangle = getCentroidTriangle3(triangle)
    const center = vec3.set(
      vec3.create(),
      centerTriangle[0],
      centerTriangle[1] + 100,
      centerTriangle[2],
    )

    // const dir = vec3.create()
    const dir = vec3.normalize(vec3.create(), center)
    console.log({ dir })

    const rotationMat = pointTowardsMat(dir)
    // mat4.transpose(rotationMat, rotationMat)

    const props: PropsBasicMaterial = {
      translate: [0, 0, 0],
      scale: [1, 1, 1],
      rotationMat,

      diffuseColor: [1, 0.2, 0.2],
      ambientColor: [0.1, 0.1, 0.1],
      lightDirection: [100, 0, 0],
    }

    loop = frameCatch(function({}) {
      camera((cameraState: any) => {
        if (!cameraState.dirty) {
          return
        }

        regl.clear({ color: [1, 1, 1, 1] })

        axis.draw()
        drawIcosphere.draw({ color: [0, 0, 0], fogColor: [1, 1, 1], fogDensity: 0.006 })
        drawCylinder.draw(props)

        drawDebug.draw({
          color: [0, 0, 0],
          translate: centerTriangle,
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
    ['p.ma0.pa2.code', 'TRS - translate rotate scale'],
    ['div.h-100', [canvas, 200, 0.025]],
  ]
}

start(app())

if ((module as any).hot) {
  ;(module as any).hot.dispose(() => {
    loop.cancel()
  })
}
