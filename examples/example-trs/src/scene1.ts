import * as tx from '@thi.ng/transducers'
import { createDrawMeshWireframe } from './draw-mesh-wireframe'
import { createBasicMesh, PropsBasicMaterial } from './draw-basic-mesh'
import { adaptDPI } from '@thi.ng/hdom-components/canvas'
import createRegl from 'regl'
import { createFrameCatch, createDrawPointDebug, createXYZ } from '@tstackgl/regl-draw'
import createCamera from 'regl-camera'
import { createCylinder } from './primitive-cylinder'
import { Mesh, Vec3 } from '@tstackgl/types'
import { getCentroidTriangle3, createIcosahedron } from '@tstackgl/geometry'
import vec3 from 'gl-vec3'
import mat4 from 'gl-mat4'
import quat from 'gl-quat'
import { Quat } from '@tstackgl/types'
import { polygonToCells } from './polygonToCells'
import { Vec2 } from '@tstackgl/types/src'

const cylinderHeight = 30
let loop = { cancel: function() {} }

type Triangle3 = [Vec3, Vec3, Vec3]

function computeMatrixToAlignCylinder(triangle: Triangle3) {
  const center = getCentroidTriangle3(triangle)
  const dir = vec3.normalize(vec3.create(), center)

  //---------------- try to find the inclination around Y axis of the triangle
  const triangleFacingYMatrix = mat4.fromQuat(
    mat4.create(),
    quat.rotationTo(quat.create(), dir, [0, 1, 0]),
  )
  const triangleFacingY = triangle.map(point =>
    vec3.transformMat4(vec3.create(), point, triangleFacingYMatrix),
  )
  const triangleFacingY2 = triangleFacingY.map(([x, y, z]) => [x, z] as Vec2)
  const p1 = triangleFacingY2[1]
  const p2 = triangleFacingY2[2]
  const a = Math.atan2(p2[1] - p1[1], p2[0] - p1[0])

  //---------------- compute the matrix
  const angleTriangle = Math.PI / 2 - a
  const delta = vec3.dist([0, 0, 0], center)
  const mat = mat4.create()
  const q: Quat = quat.rotationTo(quat.create(), [0, 1, 0], dir)
  const rotationMat = mat4.fromQuat(mat4.create(), q)
  const translate = mat4.fromTranslation(mat4.create(), [0, cylinderHeight / 2 + delta, 0])
  const scale = mat4.fromScaling(mat4.create(), [3, 1, 3])
  const rotation = mat4.fromRotation(mat4.create(), angleTriangle, [0, 1, 0])
  mat4.multiply(mat, mat, rotationMat)
  mat4.multiply(mat, mat, translate)
  mat4.multiply(mat, mat, scale)
  mat4.multiply(mat, mat, rotation)

  return { mat, dir, center }
}

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
    const camera = createCamera(regl, { distance: 600, phi: 0.4, theta: 0.4 })
    const axis = createXYZ(regl, 150)

    /* 
      ------------------------------------------ init geometry
    */

    const icosahedron: Mesh = createIcosahedron(100) //createIcosphere(100, { subdivisions: 1 })
    const cylinder: Mesh = createCylinder(15, 20, cylinderHeight, 3)

    /* 
    ------------------------------------------ calculate model matrix
    */

    const xform = tx.comp(
      tx.map((cell: Vec3) => cell.map(index => icosahedron.positions[index]) as Triangle3),
      tx.map((triangle: Triangle3) => computeMatrixToAlignCylinder(triangle)),
      tx.map(
        ({ mat, dir, center }) =>
          ({
            model: mat,
            diffuseColor: vec3.add(
              vec3.create(),
              [1, 0, 0],
              vec3.scale(vec3.create(), dir, 0.5),
            ) as Vec3,
            ambientColor: [0.1, 0.1, 0.1] as Vec3,
            lightDirection: [100, 0, 0] as Vec3,
          } as PropsBasicMaterial),
      ),
    )
    const props = tx.transduce(xform, tx.push(), icosahedron.cells)

    /* 
      ------------------------------------------ create draw commands
    */

    const drawIcosphere = createDrawMeshWireframe(regl, icosahedron)
    const drawCylinder = createBasicMesh(regl, cylinder)
    const drawDebug = createDrawPointDebug(regl, 5)

    /* 
      ------------------------------------------ draw loop
    */

    const icosahedronDebugProps = icosahedron.positions.map(point => ({
      color: [0, 0, 0] as Vec3,
      translate: point,
    }))

    loop = frameCatch(function({}) {
      camera((cameraState: any) => {
        if (!cameraState.dirty) {
          return
        }

        regl.clear({ color: [1, 1, 1, 1] })

        axis.draw()
        drawIcosphere.draw({ color: [0, 0, 0], fogColor: [1, 1, 1], fogDensity: 0.006 })
        drawCylinder.draw(props)

        drawDebug.draw([
          // ...icosahedronDebugProps,
        ])
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
