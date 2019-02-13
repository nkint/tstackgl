import createRegl from 'regl'
import { Vec3, Mat4 } from '@tstackgl/types'

const vert = `
precision mediump float;

attribute vec3 position;

uniform mat4 projection;
uniform mat4 view;
uniform mat4 model;

varying vec3 vViewPosition;

void main () {
  mat4 modelViewMatrix = view * model;
  vec4 viewModelPosition = modelViewMatrix * vec4(position, 1.0);

  vViewPosition = viewModelPosition.xyz;

  gl_Position = projection * viewModelPosition;
}`

const frag = `
precision mediump float;

// by Tom Madams
// Simple:
// https://imdoingitwrong.wordpress.com/2011/01/31/light-attenuation/
// 
// Improved
// https://imdoingitwrong.wordpress.com/2011/02/10/improved-light-attenuation/
float attenuation(float r, float f, float d) {
  float denom = d / r + 1.0;
  float attenuation = 1.0 / (denom*denom);
  float t = (attenuation - f) / (1.0 - f);
  return max(t, 0.0);
}

uniform mat4 view;
uniform vec3 color;
uniform vec3 lightPosition;
uniform float radius;
uniform float falloff;

varying vec3 vViewPosition;

void main () {

  vec4 lightViewPosition = view * vec4(lightPosition, 1.0);
  vec3 lightVector = lightViewPosition.xyz - vViewPosition;
  float lightDistance = length(lightVector);
  float lightFalloff = attenuation(radius, falloff, lightDistance);

  vec3 lightAttenuated = color * lightFalloff;

  gl_FragColor = vec4(lightAttenuated, 1.0);
}`

//------------------------------------------- props

interface PropsGeometry {
  model: Mat4
}

interface PropsLight {
  lightPosition: Vec3
  radius: Number
  falloff: Number
  color: Vec3
}

export type PropsAttenuation = PropsGeometry & PropsLight

//------------------------------------------- uniforms

interface Uniforms extends PropsAttenuation {}

//------------------------------------------- attributes

interface Attributes {
  position: Array<Vec3>
}

//------------------------------------------- regl draw command

export function createAttenuation(
  regl: createRegl.Regl,
  mesh: { positions: Vec3[]; cells: Vec3[] },
) {
  const draw = regl<Uniforms, Attributes, PropsAttenuation>({
    frag,
    vert,
    attributes: {
      position: () => mesh.positions,
    },
    uniforms: {
      model: regl.prop<PropsGeometry, 'model'>('model'),

      lightPosition: regl.prop<PropsAttenuation, 'lightPosition'>('lightPosition'),
      radius: regl.prop<PropsAttenuation, 'radius'>('radius'),
      falloff: regl.prop<PropsAttenuation, 'falloff'>('falloff'),
      color: regl.prop<PropsAttenuation, 'color'>('color'),
    },
    elements: () => mesh.cells,
  })

  return {
    draw,
  }
}
