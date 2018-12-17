import { Vec2 } from '@tstackgl/types'
import pointInPolygon from 'point-in-polygon'
import { polygonToSegments } from '../edge'
import { pointSegmentDistance } from '../calc/point-segment-distance'

export function circleInsidePolygon(circleCenter: Vec2, radius: number, polygon: Array<Vec2>) {
  return (
    pointInPolygon(circleCenter, polygon) &&
    [...polygonToSegments(polygon)].every(function(line) {
      const d = pointSegmentDistance(circleCenter, line)
      return d > radius
    })
  )
}
