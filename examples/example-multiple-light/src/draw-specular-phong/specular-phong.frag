precision mediump float;

uniform vec3 eyePosition;
uniform vec3 diffuseColor;
uniform vec3 ambientColor;
uniform float shiness;

varying vec3 vNormal;
varying vec3 vLightDirection;
varying vec3 vPos;

#pragma glslify: phongSpec = require(glsl-specular-phong) 

void main () {
  vec3 viewDirection = normalize(eyePosition - vPos);

  float brightness = phongSpec(vLightDirection, viewDirection, vNormal, shiness);
  vec3 lightColor = ambientColor + diffuseColor * brightness;
  gl_FragColor = vec4(lightColor, 1.0);
}
