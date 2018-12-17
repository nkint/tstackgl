// https://github.com/substack/point-in-polygon

declare module 'point-in-polygon' {
  import { Vec2 } from '@tstackgl/types'

  function pointInPolygon(point: Vec2, positions: ArrayLike<Vec2>): boolean

  export = pointInPolygon
}
