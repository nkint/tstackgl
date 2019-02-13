precision mediump float;

uniform vec3 eyePosition;
uniform vec3 specularColor;
uniform vec3 ambientColor;
uniform float shiness;

varying vec3 vNormal;
varying vec3 vLightDirection;
varying vec3 vPos;

#pragma glslify: gaussSpec = require(glsl-specular-gaussian) 

void main () {
  vec3 viewDirection = normalize(eyePosition - vPos);
  vec3 eyeDir = normalize(-vPos);
  float brightness = gaussSpec(vLightDirection, eyeDir, vNormal, shiness);
  vec3 lightColor = ambientColor + specularColor * brightness;
  gl_FragColor = vec4(lightColor, 1.0);
}
