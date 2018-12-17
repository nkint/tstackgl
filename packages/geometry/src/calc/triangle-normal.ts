// TODO: use this instead: https://github.com/hughsk/triangle-normal

import vec3 from 'gl-vec3'
import { Vec3 } from '@tstackgl/types'

export function triangleNormal(p0: Vec3, p1: Vec3, p2: Vec3, output?: Vec3): Vec3 {
  if (!output) output = vec3.create()

  const [x0, y0, z0] = p0
  const [x1, y1, z1] = p1
  const [x2, y2, z2] = p2

  const p1x = x1 - x0
  const p1y = y1 - y0
  const p1z = z1 - z0

  const p2x = x2 - x0
  const p2y = y2 - y0
  const p2z = z2 - z0

  const p3x = p1y * p2z - p1z * p2y
  const p3y = p1z * p2x - p1x * p2z
  const p3z = p1x * p2y - p1y * p2x

  const mag = Math.sqrt(p3x * p3x + p3y * p3y + p3z * p3z)
  if (mag === 0) {
    output[0] = 0
    output[1] = 0
    output[2] = 0
  } else {
    output[0] = p3x / mag
    output[1] = p3y / mag
    output[2] = p3z / mag
  }

  return output
}
