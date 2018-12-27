import { start } from '@thi.ng/hdom'
import { canvasWebGL, adaptDPI } from '@thi.ng/hdom-components/canvas'
import createRegl from 'regl'
import createCamera from 'regl-camera'
import {
  createFrameCatch,
  createXYZ,
  createDrawMeshUnicolor,
  createDrawMeshWireframe,
  createDrawMeshNormalLines,
} from '@tstackgl/regl-draw'
import { Vec2, Mesh } from '@tstackgl/types'
import { extrude, circleShape } from '@tstackgl/geometry'

let loop = { cancel: function() {} }

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

// canvas init hook
const initGL = (canvas: HTMLCanvasElement, __: WebGLRenderingContext) => {
  const width = canvas.parentElement ? canvas.parentElement.clientWidth : window.innerHeight
  const height = canvas.parentElement ? canvas.parentElement.clientHeight : window.innerHeight

  adaptDPI(canvas, width, height)

  console.log('initGl', canvas)
  const regl = createRegl({ canvas, extensions: ['OES_standard_derivatives'] })
  const camera = createCamera(regl, {
    distance: 30,
    phi: Math.PI / 4,
    theta: Math.PI / 4,
  })
  const frameCatch = createFrameCatch(regl)
  const axes = createXYZ(regl, 10)

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

  loop = frameCatch(function({ tick }) {
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
}

/**
 * WebGL canvas update/render hook
 *
 * @param el canvas element
 * @param gl GL context
 * @param ctx hdom user context
 * @param time ms since init
 * @param frame current frame
 * @param args component args
 */
const updateGL = (
  el: HTMLCanvasElement,
  gl: WebGLRenderingContext,
  ctx: any,
  time: number,
  frame: number,
  ...args: any[]
) => {
  // console.log({ args })
  // console.log('updateGL')
  // destructure args passed to component (see below in `app()`)
  // (ignore 1st arg, i.e. canvas attribs)
}

const app = () => {
  console.log('app')
  const attribs = { width: '100%', height: '100%' }
  const canvas = canvasWebGL({ init: initGL, update: updateGL })
  console.log(canvas)
  return ['div.h-100', ['p', 'title'], ['div.h-100', [canvas, attribs]]]
}

start(app())

// alternatively apply DOM tree only once
// (stateful components won't update though)
// createDOM(document.body, normalizeTree(app()))

if ((module as any).hot) {
  ;(module as any).hot.dispose(() => {
    loop.cancel()
  })
}
