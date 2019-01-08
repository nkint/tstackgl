precision mediump float;


attribute vec3 position;
attribute vec3 normal;

uniform mat4 projection;
uniform mat4 view;
uniform mat4 model;
uniform mat3 normalMatrix;
uniform vec3 lightPosition;

varying vec3 vNormal;
varying vec3 vLightDirection;

void main () {
  mat4 modelViewMatrix = view * model;
  vec4 viewPosition = modelViewMatrix * vec4(position, 1.0);

  vLightDirection = normalize(lightPosition);

  vNormal = normalMatrix * normal;

  gl_Position = projection * viewPosition;
}