import { Mesh } from '@tstackgl/types'
import createREGL from 'regl'
import normals from 'angle-normals'
import mat4 from 'gl-mat4'
import { Uniforms, Attributes, Props } from './types'

export const createDrawOutline = (
  regl: createREGL.Regl,
  mesh: Mesh,
  uniforms: Uniforms,
  positionsCount: number,
) => ({
  draw: regl<Uniforms, Attributes, Props>({
    frag: `
  precision highp float;
  uniform vec4 color;
  uniform float time;
  varying vec2 vuv;
  varying vec3 vposition;
  
  void main () {
    gl_FragColor = vec4(0.1, 0.1, 0.1, 1.0);
  }`,

    vert: `
  precision highp float;
  uniform mat4 projection;
  uniform mat4 model;
  uniform mat4 view;
  uniform sampler2D displacement;
  uniform float time;
  attribute vec3 position;
  attribute vec3 normal;
  attribute vec2 uv;
  varying vec2 vuv;
  varying vec3 vposition;
  void main () {
    vuv = uv;
    vposition = position;
    vec3 displaced = position + normal * texture2D(displacement, uv).rgb * abs(sin(0.005 * time) * 5.0);
    displaced = displaced - normal * 0.04;
    gl_Position = projection * view * model * vec4(displaced, 1.0);
  }`,

    attributes: {
      position: regl.buffer(mesh.positions),
      normal: regl.buffer(normals(mesh.cells, mesh.positions)),
      uv: regl.buffer(mesh.uvs),
    },

    elements: regl.elements(mesh.cells),

    primitive: 'triangles',

    uniforms,

    count: positionsCount,
  }),
})
