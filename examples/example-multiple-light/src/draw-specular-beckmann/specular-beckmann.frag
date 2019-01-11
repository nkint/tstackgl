precision mediump float;

uniform vec3 eyePosition;
uniform vec3 diffuseColor;
uniform vec3 ambientColor;
uniform float roughness;

varying vec3 vNormal;
varying vec3 vLightDirection;
varying vec3 vPos;

#pragma glslify: beckmann = require(glsl-specular-beckmann) 

void main () {
  vec3 viewDirection = normalize(eyePosition - vPos);
  vec3 eyeDir = normalize(-vPos);
  float brightness = beckmann(vLightDirection, eyeDir, vNormal, roughness);
  vec3 lightColor = ambientColor + diffuseColor * brightness;
  gl_FragColor = vec4(lightColor, 1.0);
}
