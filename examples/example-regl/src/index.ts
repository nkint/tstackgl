import createRegl from 'regl'
import { start } from '@thi.ng/hdom'
import { canvasWebGL, adaptDPI } from '@thi.ng/hdom-components/canvas'
import { hasWebGL } from '@thi.ng/checks'
import { createFrameCatch } from '@tstackgl/regl-draw'
import { createBigTriangle } from './big-triangle'
import { Vec4 } from '@tstackgl/types'

let loop = { cancel: function() {} }
const state: {
  triangleColor: Vec4
} = {
  triangleColor: [1, 0, 0, 1],
}

function createReglScene() {
  // canvas init hook
  const init = (canvas: HTMLCanvasElement, __: WebGLRenderingContext) => {
    const width = canvas.parentElement ? canvas.parentElement.clientWidth : window.innerHeight
    const height = canvas.parentElement ? canvas.parentElement.clientHeight : window.innerHeight

    adaptDPI(canvas, width, height)

    const regl = createRegl({ canvas })
    const frameCatch = createFrameCatch(regl)
    const bigTriangle = createBigTriangle(regl)

    loop = frameCatch(function({}) {
      regl.clear({
        color: [1, 1, 1, 1],
      })
      bigTriangle({ color: state.triangleColor })
    })
  }

  const update = (
    el: HTMLCanvasElement,
    gl: WebGLRenderingContext,
    ctx: any,
    time: number,
    frame: number,
    ...args: any[]
  ) => {
    const [phase, freq] = args
    const f = phase + frame * freq
    const red = Math.sin(f) * 0.5 + 0.5

    // 🎈 state mutation here!
    state.triangleColor = [red, 0, 0, 1]
  }

  return { init, update }
}

const app = () => {
  console.log('app')

  if (!hasWebGL()) {
    return ['p', 'Your browser does not support WebGL :- (']
  }

  const canvas = canvasWebGL(createReglScene())

  console.log(canvas)

  return [
    'div.h-100.flex.flex-column',
    ['p.ma0.pa2.code', 'regl basic example'],
    ['div.h-100', [canvas, 200, 0.025]],
  ]
}

start(app())

if ((module as any).hot) {
  ;(module as any).hot.dispose(() => {
    loop.cancel()
  })
}
