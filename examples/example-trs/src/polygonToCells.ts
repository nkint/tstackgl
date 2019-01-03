import { Vec3 } from '@tstackgl/types'
import * as tx from '@thi.ng/transducers'
import earcut from 'earcut'

function triangulateComplex(positions: Vec3[]) {
  // TO BE TESTED
  const positionsFlat = [...tx.mapcat(x => x, positions)]
  const cellsFlat = earcut(positionsFlat, null, 3)
  // console.log({ positionsFlat, cellsFlat })
  const cells = [...tx.partition(3, cellsFlat)] as Vec3[]
  return cells
}

const triangleFaceCells: [Vec3] = [[0, 1, 2]]

export function polygonToCells(positions: Vec3[]) {
  const cells: Array<Vec3> =
    positions.length === 3 ? triangleFaceCells : triangulateComplex(positions)
  const mesh = { positions, cells }
  return mesh
}
