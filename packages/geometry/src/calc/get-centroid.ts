import { Vec3 } from '@tstackgl/types'
import vec3 from 'gl-vec3'

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

export function getCentroidTriangle3(triangle: [Vec3, Vec3, Vec3]) {
  const result: Vec3 = vec3.create()

  result[0] = (triangle[0][0] + triangle[1][0] + triangle[2][0]) / 3
  result[1] = (triangle[0][1] + triangle[1][1] + triangle[2][1]) / 3
  result[2] = (triangle[0][2] + triangle[1][2] + triangle[2][2]) / 3

  return result
}
