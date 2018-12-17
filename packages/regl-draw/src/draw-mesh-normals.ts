import createRegl from 'regl'
import { Mesh, Vec3 } from '@tstackgl/types'
import { faceNormals } from 'normals'
import { getCentroidFromCells } from '@tstackgl/geometry'
import vec3 from 'gl-vec3'
import { tuples, mapcat, partition, range } from '@thi.ng/transducers'

const vert = `
precision mediump float;
uniform mat4 projection, view;
attribute vec3 position, color;
varying vec3 vColor;
void main () {
  vec4 mpos = projection * view * vec4(position, 1.0);
  gl_Position = mpos;
  vColor = color;
}`

const frag = `
precision mediump float;
varying vec3 vColor;
void main () {
  gl_FragColor = vec4(vColor, 1.0);
}`

interface Uniforms {
  // color: Array<Vec3>
}

interface Attributes {
  position: Array<Vec3>
  color: Array<Vec3>
}

interface Props {}

export function createDrawMeshNormalLines(regl: createRegl.Regl, mesh: Mesh, len: number = 1) {
  const faceNormalsArray = faceNormals(mesh.cells, mesh.positions)

  const colors = [...mapcat(x => [x, x], faceNormalsArray)]

  const centersArray = getCentroidFromCells(mesh.cells, mesh.positions)
  const p1Array = centersArray.map((p0, i) => {
    const out = vec3.create()
    const normalScaled = vec3.scale(out, faceNormalsArray[i], len)
    return vec3.add(out, p0, normalScaled)
  })
  const positions: Vec3[] = [...mapcat(x => x, tuples(centersArray, p1Array))]
  const cellsLen = centersArray.length * 2
  const cells = [...partition(2, [...range(cellsLen)])]

  const draw = regl<Uniforms, Attributes, Props>({
    frag,
    vert,
    attributes: {
      position: positions,
      color: colors,
    },
    uniforms: {},
    elements: cells,
  })

  return {
    draw,
  }
}
