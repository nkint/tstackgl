import { Vec2 } from '@tstackgl/types'
import { segmentSegment } from './segment-segment'
import { polygonToSegments } from '../edge'

// TODO: refactor with transduers
export function segmentPolygon(line1: [Vec2, Vec2], polygon: Vec2[]): Vec2[] {
  const linesPolygon: [Vec2, Vec2][] = [...polygonToSegments(polygon)]
  const ret = linesPolygon.reduce((acc, linePolygon) => {
    const intersection = segmentSegment(line1, linePolygon)
    if (intersection) {
      acc.push(intersection)
    }
    return acc
  }, [])
  return ret
}
