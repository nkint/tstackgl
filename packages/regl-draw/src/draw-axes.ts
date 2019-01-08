import { Mesh, Vec3 } from '@tstackgl/types'
import { combine } from '@tstackgl/geometry/src/mesh-combine-normals'
import createRegl from 'regl'
import mat4 from 'gl-mat4'
import vec3 from 'gl-vec3'
import { createCylinder } from '@tstackgl/geometry'

const vert = `
  precision mediump float;
  uniform mat4 projection, view;
  attribute vec3 position;
  attribute vec3 colorAttribute;
  varying vec3 color;
  void main () {
    color = colorAttribute;
    gl_Position = projection * view * vec4(position, 1);
  }
`

const frag = `
  precision mediump float;
  varying vec3 color;
  void main () {
    gl_FragColor = vec4(color, 1.0);
  }
`

// ----------------------------------------------------------------- lines

function createAxesLines(regl: createRegl.Regl, scale: number) {
  const mesh = {
    positions: [[0, 0, 0], [scale, 0, 0], [0, 0, 0], [0, scale, 0], [0, 0, 0], [0, 0, scale]],
    cells: [[0, 1], [2, 3], [4, 5]],
    colors: [[1, 0, 0], [1, 0, 0], [0, 1, 0], [0, 1, 0], [0, 0, 1], [0, 0, 1]],
  }

  return regl({
    vert,
    frag,
    attributes: {
      position: mesh.positions,
      colorAttribute: mesh.colors,
    },
    elements: mesh.cells,
  })
}

// ----------------------------------------------------------------- arrows

function createAxes(regl: createRegl.Regl, scale: number) {
  function getAxis(translationVec: Vec3, colorVec: Vec3, rotationVec: Vec3) {
    const arrow: Mesh = createCylinder(0, 0.1, 0.22, 4, 1)
    arrow.positions = arrow.positions.map(position => {
      const mat = mat4.create()
      mat4.translate(mat, mat, translationVec)
      mat4.rotate(mat, mat, Math.PI / 2, rotationVec)
      return vec3.transformMat4(vec3.create(), position, mat)
    })
    arrow.colors = arrow.positions.map(p => colorVec)
    return arrow
  }

  const xArrow = getAxis([scale, 0, 0], [1, 0, 0], [0, 0, -1])
  const yArrow = getAxis([0, scale, 0], [0, 1, 0], [0, 1, 0])
  const zArrow = getAxis([0, 0, scale], [0, 0, 1], [1, 0, 0])

  const meshes = [xArrow, yArrow, zArrow]
  const mesh: Mesh = combine(meshes)
  mesh.colors = [].concat(meshes.map(x => x.colors))

  return regl({
    vert,
    frag,
    attributes: {
      position: mesh.positions,
      colorAttribute: mesh.colors,
      createRegl,
    },
    elements: mesh.cells,
  })
}

export function createXYZ(regl: createRegl.Regl, scale = 1) {
  const axes = createAxes(regl, scale)
  const axesLines = createAxesLines(regl, scale)

  function draw() {
    axes()
    axesLines()
  }

  return { draw }
}
