import { adaptDPI } from '@thi.ng/hdom-components/canvas'
import createRegl from 'regl'
import { createFrameCatch, createDrawPointDebug, createXYZ } from '@tstackgl/regl-draw'
import createCamera from 'regl-camera'
import createIcosphere from 'primitive-icosphere'
import { createCylinder } from './primitive-cylinder'
import { Mesh, Vec3 } from '@tstackgl/types'
import { getCentroidTriangle3 } from '@tstackgl/geometry'
import vec3 from 'gl-vec3'

export function initScene(canvas: HTMLCanvasElement) {
  const width = canvas.parentElement ? canvas.parentElement.clientWidth : window.innerHeight
  const height = canvas.parentElement ? canvas.parentElement.clientHeight : window.innerHeight

  adaptDPI(canvas, width, height)

  const regl = createRegl({ canvas, extensions: ['OES_standard_derivatives'] })
  const frameCatch = createFrameCatch(regl)
  const camera = createCamera(regl, { distance: 400, phi: 0.4, theta: 0.4 })
  const axis = createXYZ(regl, 150)

  const icosphere: Mesh = createIcosphere(100, { subdivisions: 1 })
  const cylinder: Mesh = createCylinder(20, 20, 100, 3)

  type Triangle3 = [Vec3, Vec3, Vec3]
  const triangle = icosphere.cells[23].map(index => icosphere.positions[index]) as Triangle3
  const center = getCentroidTriangle3(triangle)

  const dir = vec3.normalize(vec3.create(), center)

  return { regl, frameCatch, camera, axis, icosphere, cylinder, center, dir }
}
