import createRegl from 'regl'
import { Vec4, Vec2 } from '@tstackgl/types'

interface Uniforms {
  color: Vec4
}

interface Attributes {
  position: Vec2[]
}

interface Props {
  color: Vec4
}

export function createBigTriangle(regl: createRegl.Regl) {
  return regl<Uniforms, Attributes, Props>({
    frag: `
    precision mediump float;
    uniform vec4 color;
    void main () {
      gl_FragColor = color;
    }`,

    vert: `
    precision mediump float;
    attribute vec2 position;
    void main () {
      gl_Position = vec4(position, 0, 1);
    }`,

    attributes: {
      position: [[-1, 0], [0, -1], [1, 1]],
    },

    uniforms: {
      color: regl.prop<Props, 'color'>('color'),
    },

    count: 3,
  })
}
