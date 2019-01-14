import createREGL from 'regl'
import heightmapVert from './heightmap.vert'
import heightmapFrag from './heightmap.frag'
import { Vec2 } from '@tstackgl/types'

type Props = {
  uTime: Number
  uResolution: Vec2
}

type Uniforms = Props

// see here: https://github.com/mikolalysenko/a-big-triangle
type Attributes = { position: Float32Array }

export const createDrawHeight = (regl: createREGL.Regl) => {
  const draw = regl<Uniforms, Attributes, Props>({
    vert: heightmapVert,
    frag: heightmapFrag,

    attributes: {
      position: new Float32Array([-1, -1, -1, 4, 4, -1]),
    },

    uniforms: {
      uTime: regl.prop<Props, 'uTime'>('uTime'),
      uResolution: regl.prop<Props, 'uResolution'>('uResolution'),
    },

    count: 3,
  })

  return { draw }
}
