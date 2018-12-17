import * as tx from '@thi.ng/transducers'
import { Vec2 } from '@tstackgl/types'

export function grid(
  bounds: [Vec2, Vec2],
  equidistance: [number, number],
): Array<[number, number]> {
  const startPoint = bounds[0]

  const numPoints = [
    Math.round((bounds[1][0] - bounds[0][0]) / equidistance[0]),
    Math.round((bounds[1][1] - bounds[0][1]) / equidistance[1]),
  ]

  // if center grid...
  const widthGrid = numPoints[0] * equidistance[0]
  const widthBounds = bounds[1][0] - bounds[0][0]
  const deltaX = -(widthBounds - widthGrid) / 2

  const heightGrid = numPoints[1] * equidistance[1]
  const heightBounds = bounds[1][1] - bounds[0][1]
  const deltaY = -(heightBounds - heightGrid) / 2

  const xform = tx.map<Vec2, Vec2>(([x, y]: [number, number]) => [
    startPoint[0] + x * equidistance[0] - deltaX,
    startPoint[1] + y * equidistance[1] - deltaY,
  ])
  const centers = tx.transduce(
    xform,
    tx.push(),
    tx.range2d(numPoints[0] + 1, numPoints[1] + 1),
  ) as Array<[number, number]>

  return centers
}
