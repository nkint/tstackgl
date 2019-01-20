import { Mat4 } from '@tstackgl/types'
import createRegl from 'regl'

export type Uniforms = {
  color: number[]
  model: Mat4
  view: (props: any, context: createRegl.DefaultContext) => Mat4
  projection: (props: any, context: createRegl.DefaultContext) => Mat4
  time: (props: any, context: createRegl.DefaultContext) => number
  displacement: createRegl.Texture2D
}

export type Attributes = {
  position: createRegl.Buffer
  normal: createRegl.Buffer
  uv: createRegl.Buffer
}

export type Props = Uniforms
