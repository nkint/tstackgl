import createRegl from 'regl'
import { Mesh, Vec3 } from '@tstackgl/types'
import { partition, wrap, map, mapcat } from '@thi.ng/transducers'

const vert = `
precision mediump float;
uniform mat4 projection, view;
attribute vec3 position;
void main () {
  vec4 mpos = projection * view * vec4(position, 1.0);
  gl_Position = mpos;
}`

const frag = `
precision mediump float;
uniform vec3 color, fogColor;
uniform float fogDensity;

float fogFactorExp(
  const float dist,
  const float density
) {
  return 1.0 - clamp(exp(-density * dist), 0.0, 1.0);
}

void main () {
  float fogDistance = gl_FragCoord.z / gl_FragCoord.w;
  float fogAmount = fogFactorExp(fogDistance, fogDensity);

  gl_FragColor = vec4(mix(color, fogColor, fogAmount), 1);
}`

interface Uniforms {
  color: Vec3
  fogColor: Vec3
  fogDensity: number
}

interface Attributes {
  position: Array<Vec3>
}

interface Props extends Uniforms {}

export const triangleToSegments = (face: Vec3) => [...partition(2, 1, wrap(face, 1, false, true))]
export const cellsToWireframeEdge = (cells: Array<Vec3>) =>
  mapcat(x => x, map(triangleToSegments, cells))

// const input: Vec3[] = [[1, 0, 3], [3, 2, 1], [5, 4, 7]]
// const expected = [[1, 0], [0, 3], [3, 1], [3, 2], [2, 1], [1, 3], [5, 4], [4, 7], [7, 5]]

export function createDrawMeshWireframe(regl: createRegl.Regl, mesh: Mesh) {
  const wireframeCells = [...cellsToWireframeEdge(mesh.cells)]

  const draw = regl<Uniforms, Attributes, Props>({
    frag,
    vert,
    attributes: {
      position: () => mesh.positions,
    },
    uniforms: {
      color: regl.prop<Props, 'color'>('color'),
      fogColor: regl.prop<Props, 'fogColor'>('fogColor'),
      fogDensity: regl.prop<Props, 'fogDensity'>('fogDensity'),
    },
    elements: wireframeCells,
    primitive: 'lines',
  })

  return {
    draw,
  }
}
