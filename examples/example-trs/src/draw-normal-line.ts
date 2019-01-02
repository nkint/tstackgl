import createRegl from 'regl'
import { Mesh, Vec3 } from '@tstackgl/types'
import { faceNormals } from 'normals'
import { getCentroidFromCells } from '@tstackgl/geometry'
import vec3 from 'gl-vec3'
import { tuples, mapcat, partition, range, map } from '@thi.ng/transducers'

const vert = `
precision mediump float;
uniform mat4 projection, view;
attribute vec3 position;
void main () {
  vec4 mpos = projection * view * vec4(position, 1.0);
  gl_Position = mpos;
}`

const frag = `
precision mediump float;
uniform vec3 color;
void main () {
  gl_FragColor = vec4(color, 1.0);
}`

interface Props {
  color: Vec3
}

interface Uniforms extends Props {}

interface Attributes {
  position: Array<Vec3>
}

export function createDrawMeshNormalLine(
  regl: createRegl.Regl,
  point: Vec3,
  normal: Vec3,
  len: number = 1,
) {
  const p2 = vec3.create()
  vec3.scale(p2, normal, len)
  vec3.add(p2, point, p2)

  const positions: Vec3[] = [point, p2]
  const cells = [0, 1]

  const draw = regl<Uniforms, Attributes, Props>({
    frag,
    vert,
    attributes: {
      position: positions,
    },
    uniforms: {
      color: regl.prop<Props, 'color'>('color'),
    },
    elements: cells,
    primitive: 'line loop',
  })

  return {
    draw,
  }
}
