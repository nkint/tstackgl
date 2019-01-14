import createRegl from 'regl'
import { Vec3, Mesh } from '@tstackgl/types'
import { Mat4 } from '@tstackgl/types/src'

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
#extension GL_OES_standard_derivatives: enable

uniform vec3 diffuseColor, ambientColor, lightDirection;
varying vec3 vViewPos;

vec3 faceNormal(vec3 pos) {
  vec3 fdx = dFdx(pos);
  vec3 fdy = dFdy(pos);
  return normalize(cross(fdx, fdy));
}

void main () {
  vec3 normal = faceNormal(vViewPos);

  float brightness = max(
    dot(
      normalize(lightDirection),
      normalize(normal)
    ), 0.4);
  vec3 lightColor = ambientColor + diffuseColor * brightness;
  gl_FragColor = vec4(lightColor, 1.0);
}
`

interface PropsGeometry {
  model: Mat4
  projection: Mat4
  view: Mat4
}

interface PropsLight {
  diffuseColor: Vec3
  ambientColor: Vec3
  lightDirection: Vec3
}

export type PropsBasicMaterial = PropsGeometry & PropsLight

interface Uniforms extends PropsBasicMaterial {}
interface Attributes {
  position: Array<Vec3>
}

export function createBasicMesh(regl: createRegl.Regl, mesh: Mesh) {
  const draw = regl<Uniforms, Attributes, PropsBasicMaterial>({
    vert,
    frag,

    attributes: {
      position: mesh.positions,
    },

    uniforms: {
      projection: regl.prop<PropsGeometry, 'projection'>('projection'),
      view: regl.prop<PropsGeometry, 'view'>('view'),
      model: regl.prop<PropsGeometry, 'model'>('model'),

      diffuseColor: regl.prop<PropsLight, 'diffuseColor'>('diffuseColor'),
      ambientColor: regl.prop<PropsLight, 'ambientColor'>('ambientColor'),
      lightDirection: regl.prop<PropsLight, 'lightDirection'>('lightDirection'),
    },

    elements: () => mesh.cells,
  })

  return { draw }
}
