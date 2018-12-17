import { QuadMesh } from '@tstackgl/types'
import * as tx from '@thi.ng/transducers'
import { Vec2, Vec3, Vec4 } from '@tstackgl/types'
import { pointInCircle } from './circle'
import vec2 from 'gl-vec2'
import { polygonToSegments } from '../edge'
import { expandSegment } from '../calc/expand-segment'
import { triRectHypotenuse } from '../calc/right-triangle'
import { angleBetweenSegments } from '../calc/angle-between'

export function chamferize(polygon: Vec2[], chamferLength: number) {
  const edges = polygonToSegments(polygon)
  const edgesCouples = [...tx.partition(2, 1, tx.wrap(edges, 1, false, true))] as Array<
    [[Vec2, Vec2], [Vec2, Vec2]]
  >
  const points = edgesCouples.map(couple => {
    const angle = angleBetweenSegments(...couple)
    const hypotenuse = triRectHypotenuse(angle / 2, chamferLength / 2)
    const p1 = expandSegment(vec2.create(), couple[0][0], couple[0][1], -hypotenuse)
    const p3 = expandSegment(vec2.create(), couple[1][1], couple[1][0], -hypotenuse)
    return [p1, p3]
  })
  const pointsFlat = [...tx.mapcat(x => x, points)]
  return pointsFlat
}

function circleShape(radius: number, center: Vec2 = [0, 0], density: number = 10) {
  return [
    ...tx.map((i: number) => {
      const delta = (i / density) * Math.PI * 2 + Math.PI / 2 // TODO: 90° di troppo
      return pointInCircle(delta, radius, center) as Vec2
    }, tx.range(density)),
  ]
}

const chamferizedCircle3 = (
  radius: number,
  origin: Vec2,
  shape: number,
  chamferLength: number,
  y: number,
) =>
  tx.map(
    ([x, z]) => [x, y, z] as Vec3,
    chamferize(circleShape(radius, origin, shape), chamferLength),
  )

function toQuadFaces(segment1: Vec2, segment2: Vec2) {
  const face1: Vec3 = [segment2[0], segment1[1], segment1[0]]
  const face2: Vec3 = [segment1[1], segment2[0], segment2[1]]

  const quad: Vec4 = [segment1[0], segment2[0], segment2[1], segment1[1]]
  return { face1, face2, quad }
}

export function createCylinderChamferMesh(
  radiusTop: number,
  radiusBottom: number,
  height: number,
  radialSegments: number,
  chamferLength: number,
): QuadMesh {
  const curriedChamferizedCircle3 = (radius: number, heightY: number) =>
    chamferizedCircle3(radius, [0, 0], radialSegments, chamferLength, heightY)

  const polygonTop = curriedChamferizedCircle3(radiusTop, height / 2)
  const polygonBotom = curriedChamferizedCircle3(radiusBottom, -height / 2)

  const positions = [...tx.concat(polygonTop, polygonBotom)]

  // TODO: refactor with transducers
  const offset = positions.length / 2
  const cells: Array<Vec3> = []
  const quadCells: Array<Vec4> = []
  for (let i = 1; i < offset; ++i) {
    const segment1: Vec2 = [i, i - 1]
    const segment2: Vec2 = segment1.map(x => x + offset) as Vec2
    const { face1, face2, quad } = toQuadFaces(segment1, segment2)
    cells.push(face1)
    cells.push(face2)
    quadCells.push(quad)
  }

  // the last one
  const segment1: Vec2 = [0, offset - 1]
  const segment2 = segment1.map(x => x + offset) as Vec2
  const { face1, face2, quad } = toQuadFaces(segment1, segment2)
  cells.push(face1)
  cells.push(face2)
  quadCells.push(quad)

  return {
    positions,
    cells,
    quadCells,
  }
}
