import * as tx from '@thi.ng/transducers'
import { createDrawMeshWireframe } from './draw-mesh-wireframe'
import { createBasicMesh, PropsBasicMaterial } from './draw-basic-mesh'
import { adaptDPI } from '@thi.ng/hdom-components/canvas'
import createRegl from 'regl'
import { createFrameCatch, createDrawPointDebug, createXYZ } from '@tstackgl/regl-draw'
import createCamera from 'regl-camera'
import createIcosphere from 'primitive-icosphere'
import { createCylinder } from './primitive-cylinder'
import { Mesh, Vec3 } from '@tstackgl/types'
import { getCentroidTriangle3 } from '@tstackgl/geometry'
import vec3 from 'gl-vec3'
import mat4 from 'gl-mat4'
import quat from 'gl-quat'
import { createDrawMeshNormalLine } from './draw-normal-line'
import { Quat } from '@tstackgl/types'

let loop = { cancel: function() {} }

const cylinderHeight = 100

export function createReglScene1() {
  const init = (canvas: HTMLCanvasElement, __: WebGLRenderingContext) => {
    /* 
      ------------------------------------------ init scene
    */
    const width = canvas.parentElement ? canvas.parentElement.clientWidth : window.innerHeight
    const height = canvas.parentElement ? canvas.parentElement.clientHeight : window.innerHeight

    adaptDPI(canvas, width, height)

    const regl = createRegl({ canvas, extensions: ['OES_standard_derivatives'] })
    const frameCatch = createFrameCatch(regl)
    const camera = createCamera(regl, { distance: 400, phi: 0.4, theta: 0.4 })
    const axis = createXYZ(regl, 150)

    const icosphere: Mesh = createIcosphere(100, { subdivisions: 1 })
    const cylinder: Mesh = createCylinder(20, 20, cylinderHeight, 3)

    const drawIcosphere = createDrawMeshWireframe(regl, icosphere)
    const drawCylinder = createBasicMesh(regl, cylinder)
    const drawDebug = createDrawPointDebug(regl, 5)

    type Triangle3 = [Vec3, Vec3, Vec3]
    const triangle = icosphere.cells[23].map(index => icosphere.positions[index]) as Triangle3
    const center = getCentroidTriangle3(triangle)

    /* 
      ------------------------------------------ calculate model matrix
    */
    const dir = vec3.normalize(vec3.create(), center)
    const delta = vec3.dist([0, 0, 0], center)
    const mat = mat4.create()
    const q: Quat = quat.rotationTo(quat.create(), [0, 1, 0], dir)
    const rotationMat = mat4.fromQuat(mat4.create(), q)
    const translate = mat4.fromTranslation(mat4.create(), [0, cylinderHeight / 2 + delta, 0])
    const scale = mat4.fromScaling(mat4.create(), [1.7, 1, 1.7])
    const rotation = mat4.fromRotation(mat4.create(), 0.65, [0, 1, 0])
    mat4.multiply(mat, mat, rotationMat)
    mat4.multiply(mat, mat, translate)
    mat4.multiply(mat, mat, scale)
    mat4.multiply(mat, mat, rotation)

    const drawNormal = createDrawMeshNormalLine(regl, center, dir, 50)
    const props: PropsBasicMaterial = {
      model: mat,
      diffuseColor: [1, 0.2, 0.2],
      ambientColor: [0.1, 0.1, 0.1],
      lightDirection: [100, 0, 0],
    }

    /* 
      ------------------------------------------ draw loop
    */

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
          translate: center,
        })
        drawNormal.draw({
          color: [0, 0, 0],
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
