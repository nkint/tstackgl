// see https://github.com/glslify/glsl-diffuse-lambert

precision mediump float;

uniform vec3 diffuseColor;
uniform vec3 ambientColor;

varying vec3 vNormal;
varying vec3 vLightDirection;

void main () {
  float brightness = max(
    dot(
      normalize(vLightDirection),
      normalize(vNormal)
    ), 0.0);
  vec3 lightColor = ambientColor + diffuseColor * brightness;
  gl_FragColor = vec4(lightColor, 1.0);
}
