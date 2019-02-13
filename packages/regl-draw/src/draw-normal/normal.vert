precision mediump float;

// #pragma glslify: transpose = require('glsl-transpose')
// #pragma glslify: inverse = require('glsl-inverse')

attribute vec3 position;
attribute vec3 normal;

uniform mat4 projection;
uniform mat4 view;
uniform mat4 model;
uniform mat3 normalMatrix;

varying vec3 vNormal;

void main () {
  mat4 modelViewMatrix = view * model;
  // mat3 normalMatrix = transpose(inverse(mat3(modelViewMatrix)));
  vNormal = normalMatrix * normal;
  gl_Position = projection * modelViewMatrix * vec4(position, 1.0);
}