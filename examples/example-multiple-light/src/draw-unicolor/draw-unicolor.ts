import createRegl from 'regl'
import { Vec3, Mat4 } from '@tstackgl/types'

const vert = `
precision mediump float;

attribute vec3 position;

uniform mat4 projection, view, model;

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

//------------------------------------------- props

interface PropsGeometry {
  model: Mat4
}

interface PropsLight {
  color: Vec3
}

export type PropsUnicolor = PropsGeometry & PropsLight

//------------------------------------------- uniforms

interface Uniforms extends PropsUnicolor {}

//------------------------------------------- attributes

interface Attributes {
  position: Array<Vec3>
}

//------------------------------------------- regl draw command

export function createDrawUnicolor(
  regl: createRegl.Regl,
  mesh: { positions: Vec3[]; cells: Vec3[] },
) {
  const draw = regl<Uniforms, Attributes, PropsUnicolor>({
    frag,
    vert,
    attributes: {
      position: () => mesh.positions,
    },
    uniforms: {
      model: regl.prop<PropsGeometry, 'model'>('model'),

      color: regl.prop<PropsUnicolor, 'color'>('color'),
    },
    elements: () => mesh.cells,
  })

  return {
    draw,
  }
}
