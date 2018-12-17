// https://github.com/mauriciopoppe/point-line-distance

declare module 'point-line-distance' {
  import { Vec2 } from '@tstackgl/types'

  function distance(point: Vec2, a: Vec2, b: Vec2): boolean

  export = distance
}
