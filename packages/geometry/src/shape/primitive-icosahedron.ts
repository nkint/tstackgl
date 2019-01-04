import { Vec3 } from '@tstackgl/types'
import vec3 from 'gl-vec3'

// https://vorg.github.io/pex/docs/pex-gen/Icosahedron.html
// http://paulbourke.net/geometry/platonic/

export function createIcosahedron(r: number = 0.5) {
  const phi = (1 + Math.sqrt(5)) / 2
  const a = 1 / 2
  const b = 1 / (2 * phi)

  const positions: Array<Vec3> = ([
    [0, b, -a],
    [b, a, 0],
    [-b, a, 0],
    [0, b, a],
    [0, -b, a],
    [-a, 0, b],
    [a, 0, b],
    [0, -b, -a],
    [a, 0, -b],
    [-a, 0, -b],
    [b, -a, 0],
    [-b, -a, 0],
  ] as Array<Vec3>).map(point => {
    vec3.normalize(point, point)
    vec3.scale(point, point, r)
    return point
  })

  const cells: Array<Vec3> = [
    [1, 0, 2],
    [2, 3, 1],
    [4, 3, 5],
    [6, 3, 4],
    [7, 0, 8],
    [9, 0, 7],
    [10, 4, 11],
    [11, 7, 10],
    [5, 2, 9],
    [9, 11, 5],
    [8, 1, 6],
    [6, 10, 8],
    [5, 3, 2],
    [1, 3, 6],
    [2, 0, 9],
    [8, 0, 1],
    [9, 7, 11],
    [10, 7, 8],
    [11, 4, 5],
    [6, 4, 10],
  ]

  const edges = [
    [0, 1],
    [0, 2],
    [0, 7],
    [0, 8],
    [0, 9],
    [1, 2],
    [1, 3],
    [1, 6],
    [1, 8],
    [2, 3],
    [2, 5],
    [2, 9],
    [3, 4],
    [3, 5],
    [3, 6],
    [4, 5],
    [4, 6],
    [4, 10],
    [4, 11],
    [5, 9],
    [5, 11],
    [6, 8],
    [6, 10],
    [7, 8],
    [7, 9],
    [7, 10],
    [7, 11],
    [8, 10],
    [9, 11],
    [10, 11],
  ]
  return {
    positions,
    cells,
    edges,
  }
}
