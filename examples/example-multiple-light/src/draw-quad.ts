import createRegl from 'regl'
import { Vec3, Mat4 } from '@tstackgl/types'

export type Quad = [Vec3, Vec3, Vec3, Vec3]

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

export function createUnicolorQuad(
  regl: createRegl.Regl,
  quad: {
    positions: Quad
  },
) {
  const cells = [[0, 1, 2], [1, 2, 3]] // TODO: test normals
  const draw = regl<Uniforms, Attributes, Props>({
    frag,
    vert,
    attributes: {
      position: () => quad.positions,
    },
    uniforms: {
      color: regl.prop<Props, 'color'>('color'),
      model: regl.prop<Props, 'model'>('model'),
    },
    elements: () => cells,
  })

  return {
    draw,
  }
}
