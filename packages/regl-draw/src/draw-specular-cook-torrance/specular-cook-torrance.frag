precision mediump float;

uniform vec3 eyePosition;
uniform vec3 specularColor;
uniform vec3 ambientColor;
uniform float roughness;
uniform float fresnel;

varying vec3 vNormal;
varying vec3 vLightDirection;
varying vec3 vPos;

#pragma glslify: cookTorranceSpec = require(glsl-specular-cook-torrance) 

void main () {
  vec3 viewDirection = normalize(eyePosition - vPos);

  float brightness = cookTorranceSpec(
    vLightDirection, 
    viewDirection, 
    vNormal, 
    roughness,
    fresnel);
  vec3 lightColor = ambientColor + specularColor * brightness;
  gl_FragColor = vec4(lightColor, 1.0);
}
