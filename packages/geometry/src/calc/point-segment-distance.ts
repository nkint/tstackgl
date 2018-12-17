import { Vec2 } from '@tstackgl/types'
import vec2 from 'gl-vec2'

export function pointSegmentDistance(point: Vec2, line: [Vec2, Vec2]) {
  const v = line[0]
  const w = line[1]
  let d
  let t
  return Math.sqrt(
    vec2.squaredDistance(
      point,
      (d = vec2.squaredDistance(v, w))
        ? (t = ((point[0] - v[0]) * (w[0] - v[0]) + (point[1] - v[1]) * (w[1] - v[1])) / d) < 0
          ? v
          : t > 1
          ? w
          : [v[0] + t * (w[0] - v[0]), v[1] + t * (w[1] - v[1])]
        : v,
    ),
  )
}
