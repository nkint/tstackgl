import { Vec2 } from '@tstackgl/types'
import pointInPolygon from 'point-in-polygon'
import { polygonToSegments } from '../edge'
import { pointSegmentDistance } from '../calc/point-segment-distance'

// TODO: refactor with transduers
export function circlePolygon(circleCenter: Vec2, radius: number, polygon: Array<Vec2>) {
  // from https://bl.ocks.org/mbostock/4218871
  return (
    pointInPolygon(circleCenter, polygon) ||
    [...polygonToSegments(polygon)].some(function(line) {
      const d = pointSegmentDistance(circleCenter, line)
      return d < radius
    })
  )
}
