precision mediump float;

uniform vec3 eyePosition;
uniform vec3 diffuseColor;
uniform vec3 ambientColor;

uniform float shinyPar;
uniform float shinyPerp;
 
varying vec3 vNormal;
varying vec3 vLightDirection;
varying vec3 vPos;
varying vec3 vFiberDirection;

#pragma glslify: wardSpec = require(glsl-specular-ward) 

void main () {
  vec3 viewDirection = normalize(eyePosition - vPos);

  vec3 normal = normalize(vNormal);
  vec3 fiberPar = normalize(vFiberDirection);
  vec3 fiberPerp = normalize(cross(vPos, vFiberDirection));
 
  //Compute specular power 
  float power = wardSpec(
    vLightDirection, 
    viewDirection, 
    normal, 
    fiberPar,
    fiberPerp,
    shinyPar,
    shinyPerp);
 
  gl_FragColor = vec4(diffuseColor * power,1.0);

}
