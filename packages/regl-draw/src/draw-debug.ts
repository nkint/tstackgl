import createRegl from 'regl'
import createSphere from 'primitive-icosphere'
import { Vec3 } from '@tstackgl/types'

const vert = `
precision mediump float;

uniform mat4 projection, view;
uniform vec3 translate;
attribute vec3 position, normal;

void main () {
  vec4 mpos = projection * view * vec4(position + translate, 1.0);
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
  translate: createREGL.Vec3
}

interface Attributes {
  position: Array<Vec3>
  normal: Array<Vec3>
}

interface Props {
  color: createRegl.Vec4
  translate: Vec3
}

export function createDrawPointDebug(regl: createRegl.Regl, radius = 0.3) {
  const mesh = createSphere(radius, { subdivisions: 2 })
  const draw = regl<Uniforms, Attributes, Props>({
    frag,
    vert,
    attributes: {
      position: () => mesh.positions,
      normal: () => mesh.normals,
    },
    uniforms: {
      color: regl.prop<Props, 'color'>('color'),
      translate: regl.prop<Props, 'translate'>('translate'),
    },
    elements: () => mesh.cells,
  })

  return {
    draw,
  }
}
