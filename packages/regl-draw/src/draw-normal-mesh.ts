import createRegl from 'regl'
import { Vec3, Mesh } from '@tstackgl/types'
import { Mat4 } from '@tstackgl/types/src'

// https://stackoverflow.com/questions/19728950/three-js-meshnormalmaterial-default-color
// https://stackoverflow.com/questions/47710377/how-to-implement-meshnormalmaterial-in-three-js-by-glsl#47710795

const vert = `
precision mediump float;

uniform mat4 projection, view, model;
attribute vec3 position, normal;
varying vec3 vViewPos;

void main () {
  vec4 mpos = projection * view * model * vec4(position, 1.0);
  vViewPos = -(projection * view * model * vec4(position, 1.0)).xyz;
  gl_Position = mpos;
}
`

const frag = `
precision mediump float;

varying vec3 vViewPos;

#extension GL_OES_standard_derivatives: enable

vec3 faceNormal(vec3 pos) {
  vec3 fdx = dFdx(pos);
  vec3 fdy = dFdy(pos);
  return normalize(cross(fdx, fdy));
}


void main () {

  vec3 normal = faceNormal(vViewPos);
  vec3 view_nv  = normal;
  vec3 nv_color = view_nv * 0.5 + 0.5; 
   gl_FragColor  = vec4(nv_color, 1.0);
}
`

interface PropsGeometry {
  model: Mat4
}

export type PropsNormalMaterial = PropsGeometry

interface Uniforms extends PropsNormalMaterial {}
interface Attributes {
  position: Array<Vec3>
}

export function createNormalMesh(regl: createRegl.Regl, mesh: Mesh) {
  const draw = regl<Uniforms, Attributes, PropsNormalMaterial>({
    vert,
    frag,

    attributes: {
      position: mesh.positions,
    },

    uniforms: {
      model: regl.prop<PropsGeometry, 'model'>('model'),
    },

    elements: () => mesh.cells,
  })

  return { draw }
}
