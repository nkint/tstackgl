import { Vec3 } from '@tstackgl/types'

export function getCentroid<T extends Array<number> | Float32Array>(points: Array<T>): T {
  // TODO: refactor with transducers
  const l = points.length

  if (l === 0) {
    return [] as T
  }

  return points.reduce(
    function(center, p, i) {
      for (let j = 0; j < p.length; j++) {
        center[j] += p[j]
      }

      if (i === l - 1) {
        for (let j = 0; j < p.length; j++) {
          center[j] /= l
        }
      }

      return center
    },
    new Float32Array(points[0].length) as T,
  )
}

export function getCentroidFromCells(cells: Array<Vec3>, positions: Array<Vec3>): Array<Vec3> {
  return cells.map(face => getCentroid(face.map(index => positions[index])))
}
