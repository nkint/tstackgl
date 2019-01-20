import createRegl from 'regl'
import { adaptDPI } from '@thi.ng/hdom-components/canvas'
import { createFrameCatch } from '@tstackgl/regl-draw'
import createSphere from 'primitive-icosphere'
import reindex from 'mesh-reindex'
import unindex from 'unindex-mesh'
import { Noise } from 'noisejs'
import mat4 from 'gl-mat4'
import { createDrawOutline } from './draw-outline'
import { createDrawTriangles } from './draw-triangles'

let loop = { cancel: function() {} }

export function createReglScene() {
  // canvas init hook
  const init = (canvas: HTMLCanvasElement, __: WebGLRenderingContext) => {
    const width = canvas.parentElement ? canvas.parentElement.clientWidth : window.innerHeight
    const height = canvas.parentElement ? canvas.parentElement.clientHeight : window.innerHeight

    adaptDPI(canvas, width, height)

    const regl = createRegl({
      canvas,
    })

    let mesh = createSphere(7, {
      subdivisions: 2,
    })
    const positionsCount = mesh.positions.length

    const uvs = mesh.uvs
    const ns = mesh.normals

    mesh = reindex(unindex(mesh.positions, mesh.cells))
    mesh.uvs = uvs
    mesh.normals = ns

    const n = new Noise(Math.random())

    let dx: Array<Array<Array<Number>>> = []
    let rnd

    for (let x = 0; x < 200; x++) {
      dx[x] = []
      for (let y = 0; y < 200; y++) {
        rnd = n.simplex2((x + 1) / 2, (y + 1) / 2)
        dx[x][y] = [rnd * 255, rnd * 255, rnd * 255]
      }
    }

    const uniforms = {
      color: [1, 0, 0, 1],
      model: mat4.scale(mat4.identity(mat4.create()), mat4.identity(mat4.create()), [2, 1, 2]),
      view: function(context: createREGL.DefaultContext) {
        const t = (0.005 * context.tick) / 2
        return mat4.lookAt(
          mat4.create(),
          [30 * Math.cos(t), 5, 30 * Math.sin(t)],
          [0, 2.5, 0],
          [0, 1, 0],
        )
      },
      projection: function(context: createREGL.DefaultContext) {
        return mat4.perspective(
          mat4.create(),
          Math.PI / 4,
          context.viewportWidth / context.viewportHeight,
          0.01,
          1000,
        )
      },
      time: function(context: createREGL.DefaultContext) {
        return context.tick
      },
      displacement: regl.texture(dx as any),
    }

    const frameCatch = createFrameCatch(regl)

    const drawOutline = createDrawOutline(regl, mesh, uniforms, positionsCount)
    const drawTriangles = createDrawTriangles(regl, mesh, uniforms, positionsCount)

    loop = frameCatch(function({}) {
      regl.clear({
        depth: 1,
        color: [0, 0, 0, 1],
      })
      drawOutline.draw()
      drawTriangles.draw()
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
