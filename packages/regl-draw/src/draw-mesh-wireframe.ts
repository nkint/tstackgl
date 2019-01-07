import createRegl from 'regl'
import { Mesh, Vec3, Mat4 } from '@tstackgl/types'
import { partition, wrap, map } from '@thi.ng/transducers'

const vert = `
precision mediump float;
uniform mat4 projection, view, model;
attribute vec3 position;
void main () {
  vec4 mpos = projection * view * model * vec4(position, 1.0);
  gl_Position = mpos;
}`

const frag = `
precision mediump float;
uniform vec3 color;
void main () {
  gl_FragColor = vec4(color, 1.0);
}`

interface Attributes {
  position: Array<Vec3>
}

interface Props {
  color: Vec3
  model: Mat4
}

interface Uniforms extends Props {}

export function createDrawMeshWireframe(regl: createRegl.Regl, mesh: Mesh) {
  // const input: Vec3[] = [[1, 0, 3], [3, 2, 1], [5, 4, 7]]
  // const expected = [[[1, 0], [0, 3], [3, 1]], [[3, 2], [2, 1], [1, 3]], [[5, 4], [4, 7], [7, 5]]]

  const triangleToSegments = ([a, b, c]: Vec3) => [[a, b], [b, c], [c, a]]
  const wireframeCells = [...map(triangleToSegments, mesh.cells)]

  const draw = regl<Uniforms, Attributes, Props>({
    frag,
    vert,
    attributes: {
      position: () => mesh.positions,
    },
    uniforms: {
      color: regl.prop<Props, 'color'>('color'),
      model: regl.prop<Props, 'model'>('model'),
    },
    elements: wireframeCells,
    primitive: 'lines',
  })

  return {
    draw,
  }
}
