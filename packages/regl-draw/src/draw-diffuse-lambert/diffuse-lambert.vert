precision mediump float;


attribute vec3 position;
attribute vec3 normal;

uniform mat4 projection;
uniform mat4 view;
uniform mat4 model;
uniform mat3 normalMatrix;
uniform vec3 lightPosition;

varying vec3 vNormal;
varying vec3 vPos;
varying vec3 vLightDirection;

void main () {
  mat4 modelViewMatrix = view * model;
  vec4 viewPosition = modelViewMatrix * vec4(position, 1.0);
  vPos = (modelViewMatrix * vec4(position, 1.0)).xyz;
  vNormal = normalMatrix * normal;

  vec3 lightViewPosition =  (view * vec4(lightPosition, 1.0)).xyz;
  vLightDirection = normalize(lightViewPosition - vPos);
  

  gl_Position = projection * viewPosition;
}