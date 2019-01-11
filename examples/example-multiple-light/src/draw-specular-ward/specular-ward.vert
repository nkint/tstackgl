precision mediump float;

attribute vec3 position;
attribute vec3 normal;
attribute vec2 uv;

uniform mat4 projection;
uniform mat4 view;
uniform mat4 model;
uniform mat3 normalMatrix;
uniform vec3 lightPosition;

varying vec3 vNormal;
varying vec3 vLightDirection;
varying vec3 vPos;
varying vec3 vFiberDirection;

void main () {
  mat4 modelViewMatrix = view * model;
  vNormal = normalMatrix * normal;
  vPos = (modelViewMatrix * vec4(position, 1.0)).xyz;

  vec3 lightViewPosition =  (view * vec4(lightPosition, 1.0)).xyz;
  vLightDirection = normalize(lightViewPosition - vPos);
  
  vFiberDirection = normalize(vec3(uv,0) - dot(vec3(uv,0), normal)*normal);

  gl_Position = projection * modelViewMatrix * vec4(position, 1.0);
}