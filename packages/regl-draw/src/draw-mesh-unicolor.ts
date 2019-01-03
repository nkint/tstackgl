import createRegl from 'regl'
import { Vec3 } from '@tstackgl/types'

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

interface Attributes {
  position: Array<Vec3>
}

export interface PropsMeshUnicolor {
  color: createRegl.Vec4
}

interface Uniforms extends PropsMeshUnicolor {}

export function createDrawMeshUnicolor(
  regl: createRegl.Regl,
  mesh: { positions: Vec3[]; cells: Vec3[] },
) {
  const draw = regl<Uniforms, Attributes, PropsMeshUnicolor>({
    frag,
    vert,
    attributes: {
      position: () => mesh.positions,
    },
    uniforms: {
      color: regl.prop<PropsMeshUnicolor, 'color'>('color'),
    },
    elements: () => mesh.cells,
  })

  return {
    draw,
  }
}
