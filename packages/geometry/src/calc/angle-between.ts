import { Vec2 } from '@tstackgl/types'
import vec2 from 'gl-vec2'

export function angleBetweenSegments(v1: [Vec2, Vec2], v2: [Vec2, Vec2]) {
  const dir1: Vec2 = vec2.set(vec2.create(), v1[1][0] - v1[0][0], v1[1][1] - v1[0][1])
  vec2.normalize(dir1, dir1)
  const dir2: Vec2 = vec2.set(vec2.create(), v2[1][0] - v2[0][0], v2[1][1] - v2[0][1])
  vec2.normalize(dir2, dir2)
  return Math.acos(vec2.dot(dir1, dir2))
}

export function angleBetween(dir1: Vec2, dir2: Vec2) {
  return Math.acos(vec2.dot(dir1, dir2))
}
