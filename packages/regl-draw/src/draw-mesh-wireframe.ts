import createRegl from 'regl'
import { Mesh, Vec3 } from '@tstackgl/types'
import { partition, wrap, map } from '@thi.ng/transducers'

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
uniform vec4 color;
void main () {
  gl_FragColor = color;
}`

interface Uniforms {
  color: createRegl.Vec4
}

interface Attributes {
  position: Array<Vec3>
}

interface Props {
  color: createRegl.Vec4
}

export function createDrawMeshWireframe(regl: createRegl.Regl, mesh: Mesh) {
  // const input: Vec3[] = [[1, 0, 3], [3, 2, 1], [5, 4, 7]]
  // expected = "[[[1,0],[0,3],[3,1]],[[3,2],[2,1],[1,3]],[[5,4],[4,7],[7,5]]]"

  const triangleToSegments = (face: Vec3) => [...partition(2, 1, wrap(face, 1, false, true))]
  const wireframeCells = [...map(triangleToSegments, mesh.cells)]

  const draw = regl<Uniforms, Attributes, Props>({
    frag,
    vert,
    attributes: {
      position: () => mesh.positions,
    },
    uniforms: {
      color: regl.prop<Props, 'color'>('color'),
    },
    elements: wireframeCells,
    primitive: 'lines',
  })

  return {
    draw,
  }
}
