import { Vec2 } from '@tstackgl/types'
import vec2 from 'gl-vec2'

export function segmentSegment(segment1: [Vec2, Vec2], segment2: [Vec2, Vec2]): Vec2 {
  // https://github.com/Turfjs/turf/blob/master/packages/turf-line-intersect/index.ts#L79
  const x1 = segment1[0][0]
  const y1 = segment1[0][1]
  const x2 = segment1[1][0]
  const y2 = segment1[1][1]
  const x3 = segment2[0][0]
  const y3 = segment2[0][1]
  const x4 = segment2[1][0]
  const y4 = segment2[1][1]
  const denom = (y4 - y3) * (x2 - x1) - (x4 - x3) * (y2 - y1)
  const numeA = (x4 - x3) * (y1 - y3) - (y4 - y3) * (x1 - x3)
  const numeB = (x2 - x1) * (y1 - y3) - (y2 - y1) * (x1 - x3)

  if (denom === 0) {
    if (numeA === 0 && numeB === 0) {
      return null
    }
    return null
  }

  const uA = numeA / denom
  const uB = numeB / denom

  if (uA >= 0 && uA <= 1 && uB >= 0 && uB <= 1) {
    const x = x1 + uA * (x2 - x1)
    const y = y1 + uA * (y2 - y1)
    return vec2.set(vec2.create(), x, y)
  }
  return null
}
