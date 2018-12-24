import createRegl from 'regl'
import { Vec4, Vec3, Mesh } from '@tstackgl/types'

const vert = `
precision mediump float;

uniform mat4 projection, view;
uniform vec3 translate, scale;
attribute vec3 position, normal;
varying vec3 vViewPos;

void main () {
  vec3 pos = (position * scale) + translate;
  vec4 mpos = projection * view * vec4(pos, 1.0);
  vViewPos = -(projection * view * vec4(pos, 1.0)).xyz;
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
  translate: Vec3
  scale: Vec3
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

export function createDrawMesh(regl: createRegl.Regl, mesh: Mesh) {
  return regl<Uniforms, Attributes, PropsBasicMaterial>({
    vert,
    frag,

    attributes: {
      position: mesh.positions,
    },

    uniforms: {
      translate: regl.prop<PropsGeometry, 'translate'>('translate'),
      scale: regl.prop<PropsGeometry, 'scale'>('scale'),

      diffuseColor: regl.prop<PropsLight, 'diffuseColor'>('diffuseColor'),
      ambientColor: regl.prop<PropsLight, 'ambientColor'>('ambientColor'),
      lightDirection: regl.prop<PropsLight, 'lightDirection'>('lightDirection'),
    },

    elements: () => mesh.cells,
  })
}
