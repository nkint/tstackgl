// import * as tx from '@thi.ng/transducers'
import earcut from 'earcut'
import { Vec3, Vec2 } from '@tstackgl/types'
import { getCentroid } from '../get-centroid'
import { polygonToSegments } from '../../edge'
import { scaleAroundCenter3 } from '../pivot'
import {
  mapcat,
  map,
  tuples,
  partition,
  wrap,
  concat,
  repeat,
  take,
  takeLast,
  range,
} from '@thi.ng/transducers'

function triangulate(vertices: ArrayLike<number>, holes: ArrayLike<number>, dimensions = 2) {
  return earcut(vertices, holes, dimensions)
}

const identity = (x: Vec3[]) => x

export function getSideCells(
  segmentsTopCells: IterableIterator<[number, number]>,
  segmentsBottomCells: IterableIterator<[number, number]>,
) {
  return [
    ...mapcat(
      identity,
      map(
        ([segment1, segment2]) =>
          [
            [segment2[1], segment2[0], segment1[0]],
            [segment2[1], segment1[0], segment1[1]],
          ] as Vec3[],
        tuples(segmentsTopCells, segmentsBottomCells),
      ),
    ),
  ]
}

export function extrude(
  inputPolygons: Array<Array<Vec2>>,
  opts = {
    depthTop: 2,
    depthBottom: -1,
    bevelTop: 0.2,
    bevelBottom: 0.9,
  },
) {
  const newPolygon = inputPolygons
  const hasHoles = newPolygon.length > 1

  const { vertices, holes, dimensions } = earcut.flatten(newPolygon)

  if (dimensions !== 2) {
    throw new Error('Only 2D polygon points are supported')
  }

  // convertToClockwise(vertices, holes) // TODO: does not seems to work well, actually
  const indices = triangulate(vertices, holes, dimensions)

  const { depthTop, depthBottom, bevelTop, bevelBottom } = opts

  const center = getCentroid(inputPolygons[0])
  const centers: Vec3[] = [[...center, depthTop] as Vec3, [...center, depthBottom] as Vec3]

  // positions is an array of the faces extruded:
  // once with z = depthTop, once with z = depthBottom
  const nPos = vertices.length
  const xy = partition(2, wrap(vertices, nPos, false))
  const offsetsDepth = concat(repeat(depthTop, nPos / 2), repeat(depthBottom, nPos / 2))
  const positions: Vec3[] = [...map(([[x, y], z]) => [x, y, z] as Vec3, tuples(xy, offsetsDepth))]

  // TODO: bevel should be done on 2d polygon actually, and triangulate twice for bottom and top, shit!
  // apply bevelTop to top external polygon and bevelBottom to bottom external polygon
  for (let i = 0; i < inputPolygons[0].length; i++) {
    positions[i] = scaleAroundCenter3(positions[i], positions[i], centers[0], bevelTop)
  }
  for (let i = positions.length / 2; i < positions.length / 2 + inputPolygons[0].length; i++) {
    positions[i] = scaleAroundCenter3(positions[i], positions[i], centers[1], bevelBottom)
  }

  const nCell = indices.length / 3
  const facesTop = [...partition(3, indices)]
  // notice that for normals directions the bottom face index has to be reversed: that's why `.slice().reverse()`
  const facesBottom = map(face => face.slice().reverse(), facesTop)
  const facesTopBottom = concat(facesTop, facesBottom)
  const offsetsIndex = concat(repeat(0, nCell), repeat(nPos / 2, nCell))
  const cells: Vec3[] = [
    ...map(([face, n]) => face.map(f => f + n) as Vec3, tuples(facesTopBottom, offsetsIndex)),
  ]

  let sideCells: Vec3[] = []
  if (!hasHoles) {
    const len = inputPolygons[0].length * 2
    const flatCells = [...range(len)]
    const segmentsTopCells = polygonToSegments(take(len / 2, flatCells))
    const segmentsBottomCells = polygonToSegments(takeLast(len / 2, flatCells))

    sideCells = getSideCells(segmentsTopCells, segmentsBottomCells)
  } else {
    const polygonsIdx = [
      range(0, inputPolygons[0].length) as IterableIterator<number>, //top
      range(
        positions.length / 2,
        positions.length / 2 + inputPolygons[0].length,
      ) as IterableIterator<number>, // bottom
    ]

    const segmentsTopCells = polygonToSegments(polygonsIdx[0])
    const segmentsBottomCells = polygonToSegments(polygonsIdx[1])
    sideCells = getSideCells(segmentsTopCells, segmentsBottomCells)

    // TODO: refactor with transducers
    let cursor = inputPolygons[0].length
    const holesIdx = inputPolygons.slice(1).map(hole => {
      const ret = [
        range(cursor, cursor + hole.length) as IterableIterator<number>, //top
        range(
          positions.length / 2 + cursor,
          positions.length / 2 + cursor + hole.length,
        ) as IterableIterator<number>, // bottom
      ]
      cursor += hole.length
      return ret
    })

    const holesSideCells = holesIdx.reduce((acc: Vec3[], holeIdx) => {
      const segmentsTopCells = polygonToSegments(holeIdx[0])
      const segmentsBottomCells = polygonToSegments(holeIdx[1])
      const holeSideCells = getSideCells(segmentsTopCells, segmentsBottomCells)
      acc.push(...holeSideCells)
      return acc
    }, [])

    sideCells.push(...holesSideCells)
  }

  cells.push(...sideCells)

  return {
    positions,
    cells: cells,
  }
}
