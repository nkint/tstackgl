import createRegl from 'regl'
import createCamera from 'regl-camera'
import { Vec2, Mesh } from '@tstackgl/types'
import {
  createFrameCatch,
  createXYZ,
  createDrawMeshUnicolor,
  createDrawMeshWireframe,
} from '@tstackgl/regl-draw'
import { createDrawMeshNormalLines } from './dd'
import { extrude, circleShape } from '@tstackgl/geometry'

console.log('dudee', createFrameCatch)

const container = document.querySelector('#root') // document.body
const canvas = document.createElement('canvas')
container.appendChild(canvas)

var scale = window.devicePixelRatio
var width = window.innerWidth
var height = window.innerHeight
canvas.width = width * scale
canvas.height = height * scale
canvas.style.width = width + 'px'
canvas.style.height = height + 'px'

const regl = createRegl({ canvas, extensions: ['OES_standard_derivatives'] })
const camera = createCamera(regl, {
  distance: 30,
  phi: Math.PI / 4,
  theta: Math.PI / 4,
})
const frameCatch = createFrameCatch(regl)
const axes = createXYZ(regl, 10)

function getPolygon() {
  const c1: [number, Vec2] = [2.5, [2.5, 2.5]]
  const c2: [number, Vec2] = [0.5, [1.8, 1.8]]
  const c3: [number, Vec2] = [0.5, [3.2, 3.2]]

  return [
    [...circleShape(...c1).reverse()], // polygon
    [...circleShape(...c2).reverse()], // hole 1
    [...circleShape(...c3).reverse()], // hole 2
  ]
}

const inputPolygon = getPolygon()
const extrudedMesh: Mesh = extrude(inputPolygon, {
  depthTop: 0.1,
  depthBottom: 0,
  bevelTop: 0.95,
  bevelBottom: 1,
})

const extruded = createDrawMeshUnicolor(regl, extrudedMesh)
const extrudedWireframe = createDrawMeshWireframe(regl, extrudedMesh)
const extrudedNormals = createDrawMeshNormalLines(regl, extrudedMesh, 0.5)

const loop = frameCatch(function({ tick }) {
  regl.clear({
    color: [1, 1, 1, 1],
  })
  camera(() => {
    axes()
    extruded.draw({ color: [0.6, 0.6, 0.6, 1] })
    extrudedWireframe.draw({ color: [0.4, 0.4, 0.4, 1] })
    extrudedNormals.draw()
  })
})

if ((module as any).hot) {
  ;(module as any).hot.dispose(() => {
    canvas.remove()
    loop.cancel()
  })
}
