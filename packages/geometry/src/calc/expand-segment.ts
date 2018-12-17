import vec2 from 'gl-vec2'
import { Vec2 } from '@tstackgl/types'

export function expandSegment(out: Vec2, p1: Vec2, p2: Vec2, len: number): Vec2 {
  // see https://github.com/postspectacular/toxiclibs/blob/master/src.core/toxi/geom/Ray2D.java#L73
  const dir: Vec2 = vec2.set(out, p2[0] - p1[0], p2[1] - p1[1])
  vec2.normalize(dir, dir)
  vec2.scale(dir, dir, len)
  return vec2.add(dir, p2, dir)
}
