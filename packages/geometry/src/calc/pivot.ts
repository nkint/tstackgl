import { Vec2, Vec3 } from '@tstackgl/types'
import vec2 from 'gl-vec2'

export function scaleAroundCenter2(out: Vec2, input: Vec2, center: Vec2, scale: number) {
  out[0] = (input[0] - center[0]) * scale + center[0]
  out[1] = (input[1] - center[1]) * scale + center[1]
  return out
}

export function rotateAroundCenter2(out: Vec2, input: Vec2, center: Vec2, angle: number) {
  vec2.sub(out, input, center)
  vec2.rotate(out, out, angle)
  vec2.add(out, out, center)
  return out
}

export function scaleAroundCenter3(out: Vec3, input: Vec3, center: Vec3, scale: number) {
  out[0] = (input[0] - center[0]) * scale + center[0]
  out[1] = (input[1] - center[1]) * scale + center[1]
  out[2] = (input[2] - center[2]) * scale + center[2]
  return out
}
