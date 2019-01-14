import createRegl from 'regl'
import { start } from '@thi.ng/hdom'
import { canvasWebGL, adaptDPI } from '@thi.ng/hdom-components/canvas'
import { hasWebGL } from '@thi.ng/checks'
import { createFrameCatch } from '@tstackgl/regl-draw'
import qbqb from 'cube-cube'
import unindex from 'unindex-mesh'
import { combine } from '@tstackgl/geometry'
import clone from 'clone'
import mat4 from 'gl-mat4'
import quat from 'gl-quat'
import gradientMap from './gradient-map'
import { Mesh, Vec3, Vec2 } from '@tstackgl/types'
import normals from 'face-normals'
import createCamera from 'orbit-camera'
import { createDrawHeight } from './draw-height'
import { PropsVoxel, createDrawVoxel } from './draw-voxel'

let loop = { cancel: function() {} }

const SIZE = 16
const TIMESCALE = 0.5
const RES: Vec2 = [1 / SIZE, 1 / SIZE]

function getCentroids(meshes: Array<Mesh & { centroid: Vec3 }>) {
  return meshes.map(function(mesh) {
    mesh = clone(mesh)

    for (let i = 0; i < mesh.positions.length; i++) {
      mesh.positions[i] = mesh.centroid
    }

    return mesh
  })
}

function getEdges(meshes: Array<Mesh & { index: Vec3 }>) {
  return meshes.map(function(mesh) {
    mesh = clone(mesh)

    var idx = mesh.index

    for (let i = 0; i < mesh.positions.length; i++) {
      var pos = mesh.positions[i]
      mesh.positions[i] = mesh.positions[i].slice() as Vec3
      mesh.positions[i][0] = (pos[0] * SIZE - idx[0] - 0.5) * 2
      mesh.positions[i][2] = (pos[2] * SIZE - idx[2] - 0.5) * 2
      mesh.positions[i][1] = (pos[1] - idx[1] - 0.5) * 2
    }

    return mesh
  })
}

function createMesh() {
  const voxels = qbqb(SIZE, 1, SIZE)
  const positions = unindex(combine(voxels))
  const edges = unindex(combine(getEdges(voxels)))
  const centroids = unindex(combine(getCentroids(voxels)))

  return {
    positions: positions,
    centroids: centroids,
    normals: normals(positions),
    edges: edges,
  }
}

const getTime =
  window.performance && window.performance.now
    ? function now() {
        return performance.now()
      }
    : Date.now ||
      function now() {
        return +new Date()
      }

function createReglScene() {
  // canvas init hook
  const init = (canvas: HTMLCanvasElement, __: WebGLRenderingContext) => {
    const width = canvas.parentElement ? canvas.parentElement.clientWidth : window.innerHeight
    const height = canvas.parentElement ? canvas.parentElement.clientHeight : window.innerHeight

    adaptDPI(canvas, width, height)

    const regl = createRegl({ canvas, extensions: ['OES_standard_derivatives'] })
    const frameCatch = createFrameCatch(regl)

    const fboParams = {
      depth: false, // this is really important. why?!?
      cull: {
        enable: false,
      },
    }
    const heightmapTexture = regl.texture({
      shape: [SIZE, SIZE],
      wrap: 'clamp',
      min: 'nearest',
      mag: 'nearest',
    })
    const heightmap = regl.framebuffer({ color: heightmapTexture, ...fboParams })
    // const heightmap = regl.framebuffer({
    //   shape: [SIZE, SIZE],
    //   ...fboParams,
    //   stencil: false
    // })

    const gradient = regl.texture(gradientMap)
    const projection = mat4.create()
    const viewrot = mat4.create()
    const view = mat4.create()
    const camera = createCamera([0, 10, 30], [0, 0, 0], [0, 1, 0])
    camera.distance = 1.5

    const model = mat4.create()
    mat4.translate(model, model, [-0.5, 0, -0.5])

    const drawHeight = createDrawHeight(regl)

    const voxels = createMesh()
    const drawVoxel = createDrawVoxel(regl, voxels)

    console.log('dude')
    loop = frameCatch(function(context: createREGL.DefaultContext) {
      const now = getTime() * TIMESCALE
      const width = canvas.width
      const height = canvas.height

      regl.clear({ color: [1, 1, 1, 1] })

      heightmap.use(() => {
        drawHeight.draw({
          uTime: now * 0.8,
          uResolution: RES,
        })
      })

      mat4.perspective(projection, Math.PI / 4, width / height, 0.001, 100)

      quat.identity(camera.rotation)
      quat.rotateY(camera.rotation, camera.rotation, now * 0.0002)
      quat.rotateX(camera.rotation, camera.rotation, -0.5)
      camera.view(view)

      quat.identity(camera.rotation)
      quat.rotateY(camera.rotation, camera.rotation, now * 0.0002)

      const voxelProps: PropsVoxel = {
        uResolution: RES,
        uViewRotation: mat4.fromQuat(viewrot, camera.rotation),
        uProjection: projection,
        uModel: model,
        uView: view,
        tHeightmap: heightmap,
        tGradient: gradient,
      }
      drawVoxel.draw(voxelProps)
    })
  }

  const update = () => {}

  return { init, update }
}

const app = () => {
  if (!hasWebGL()) {
    return ['p', 'Your browser does not support WebGL :- (']
  }

  const canvas = canvasWebGL(createReglScene())

  return [
    'div.h-100.flex.flex-column',
    ['p.ma0.pa2.code', 'stack.gl splash screen'],
    ['div.h-100', [canvas]],
  ]
}

start(app())

if ((module as any).hot) {
  ;(module as any).hot.dispose(() => {
    loop.cancel()
  })
}
