import { Vec2 } from '@tstackgl/types'
import * as tr from '@thi.ng/transducers'

export function pointInCircle(t: number, radius: number, center: Vec2 = [0, 0]) {
  return [Math.cos(t) * radius + center[0], Math.sin(t) * radius + center[1]]
}

export function circleShape(radius: number, center: Vec2 = [0, 0], density: number = 10) {
  return [
    ...tr.map((i: number) => {
      const delta = (i / density) * Math.PI * 2
      return pointInCircle(delta, radius, center) as Vec2
    }, tr.range(density)),
  ]
}
