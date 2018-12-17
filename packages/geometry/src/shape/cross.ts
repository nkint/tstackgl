import { Vec2 } from '@tstackgl/types'
import vec2 from 'gl-vec2'

export function crossShape(origin: Vec2) {
  return ([[-1, 0], [1, 0], [0, 1], [0, -1]] as Vec2[]).map(point => vec2.add(point, point, origin))
}
