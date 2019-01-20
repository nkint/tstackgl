import createRegl from 'regl'
import normals from 'angle-normals'
import { Mesh } from '@tstackgl/types'
import { Uniforms, Attributes, Props } from './types'

export const createDrawTriangles = (regl: createREGL.Regl, mesh: Mesh, uniforms: Uniforms) => ({
  draw: regl<Uniforms, Attributes, Props>({
    frag: `
  precision highp float;
  uniform vec4 color;
  uniform float time;
  varying vec2 vuv;
  varying vec3 vposition;
  varying vec3 vnormal;
  vec3 palette(float t, vec3 a, vec3 b, vec3 c, vec3 d) {
    return a + b*cos( 6.28318*(c*t+d) );
  }
  void main () {
    vec3 a = vec3(0.5, 0.5, 0.5);
    vec3 b = vec3(0.5, 0.5, 0.5);
    vec3 c = abs(vnormal);
    vec3 d = (0.05 * abs(vposition));
    gl_FragColor = vec4(palette(sin(0.005 * time + 0.5), a, d, b, c), 1.0) * 1.0;
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
  varying vec3 vnormal;
  void main () {
    vuv = uv;
    vposition = position;
    vnormal = normal;
    vec3 displaced = position + normal * texture2D(displacement, uv).rgb * abs(sin(0.005 * time) * 5.0);
    gl_Position = projection * view * model * vec4(displaced, 1.0);
  }`,

    attributes: {
      position: regl.buffer(mesh.positions),
      normal: regl.buffer(normals(mesh.cells, mesh.positions)),
      uv: regl.buffer(mesh.uvs),
    },

    elements: regl.elements(mesh.cells),

    primitive: 'triangles',

    uniforms: uniforms,

    count: 799,
  }),
})
