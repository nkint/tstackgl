// see https://github.com/glslify/glsl-diffuse-oren-nayar

precision mediump float;

#define PI 3.14159265

uniform vec3 eyePosition;
uniform vec3 diffuseColor;
uniform vec3 ambientColor;
uniform float roughness;
uniform float albedo;

varying vec3 vNormal;
varying vec3 vLightDirection;
varying vec3 vPos;

float orenNayarDiffuse(
  vec3 _lightDirection,
  vec3 _viewDirection,
  vec3 _surfaceNormal,
  float _roughness,
  float _albedo) {
  
  float LdotV = dot(_lightDirection, _viewDirection);
  float NdotL = dot(_lightDirection, _surfaceNormal);
  float NdotV = dot(_surfaceNormal, _viewDirection);

  float s = LdotV - NdotL * NdotV;
  float t = mix(1.0, max(NdotL, NdotV), step(0.0, s));

  float sigma2 = _roughness * _roughness;
  float A = 1.0 + sigma2 * (_albedo / (sigma2 + 0.13) + 0.5 / (sigma2 + 0.33));
  float B = 0.45 * sigma2 / (sigma2 + 0.09);

  return _albedo * max(0.0, NdotL) * (A + B * s / t) / PI;
}

void main () {
  vec3 viewDirection = normalize(eyePosition - vPos);

  float brightness = orenNayarDiffuse(vLightDirection, viewDirection, vNormal, roughness, albedo);
  vec3 lightColor = ambientColor + diffuseColor * brightness;
  gl_FragColor = vec4(lightColor, 1.0);
}
