import createRegl from 'regl'
import { Vec4, Vec3, Mesh } from '@tstackgl/types'

const vert = `
precision mediump float;

uniform mat4 projection, view;
uniform vec3 translate, scale;
attribute vec3 position, normal;

void main () {
  vec3 pos = ((position * scale) + translate);
  vec4 mpos = projection * view * vec4(pos, 1.0);
  gl_Position = mpos;
}
`

const frag = `
precision mediump float;
uniform vec4 color;
void main () {
  gl_FragColor = color;
}
`

interface Uniforms {
  color: Vec4
  translate: Vec3
  scale: Vec3
}

interface Attributes {
  position: Array<Vec3>
}

export interface Props {
  color: Vec4
  translate: Vec3
  scale: Vec3
}

export function createDrawMesh(regl: createRegl.Regl, mesh: Mesh) {
  return regl<Uniforms, Attributes, Props>({
    vert,
    frag,

    attributes: {
      position: mesh.positions,
    },

    uniforms: {
      color: regl.prop<Props, 'color'>('color'),
      translate: regl.prop<Props, 'translate'>('translate'),
      scale: regl.prop<Props, 'scale'>('scale'),
    },

    elements: () => mesh.cells,
  })
}
