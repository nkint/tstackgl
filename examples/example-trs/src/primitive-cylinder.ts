import { QuadMesh } from '@tstackgl/types'
import * as tx from '@thi.ng/transducers'
import { Vec2, Vec3, Vec4 } from '@tstackgl/types'
import { circleShape } from '@tstackgl/geometry'

function toQuadFaces(segment1: Vec2, segment2: Vec2) {
  const face1: Vec3 = [segment2[0], segment1[1], segment1[0]]
  const face2: Vec3 = [segment1[1], segment2[0], segment2[1]]
  const quad: Vec4 = [segment1[0], segment2[0], segment2[1], segment1[1]]
  return { face1, face2, quad }
}

export function createCylinder(
  radiusTop: number,
  radiusBottom: number,
  height: number,
  radialSegments: number,
): QuadMesh {
  const circle3 = (radius: number, y: number, shape: number) =>
    tx.map(([x, z]) => [x, y, z] as Vec3, circleShape(radius, [0, 0], shape))

  const polygonTop = circle3(radiusTop, height / 2, radialSegments)
  const polygonBotom = circle3(radiusBottom, -height / 2, radialSegments)

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
