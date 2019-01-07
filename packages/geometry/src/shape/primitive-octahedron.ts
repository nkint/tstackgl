import { Vec3, Vec2 } from '@tstackgl/types'
import vec3 from 'gl-vec3'

// https://vorg.github.io/pex/docs/pex-gen/Octahedron.html
// http://paulbourke.net/geometry/platonic/

export function createOctahedron(r: number = 0.5) {
  const a = 1 / (2 * Math.sqrt(2))
  const b = 1 / 2

  const s3 = Math.sqrt(3)
  const s6 = Math.sqrt(6)

  const positions: Array<Vec3> = ([
    [-a, 0, a], //front left
    [a, 0, a], //front right
    [a, 0, -a], //back right
    [-a, 0, -a], //back left
    [0, b, 0], //top
    [0, -b, 0], //bottom
  ] as Array<Vec3>).map(point => {
    vec3.normalize(point, point)
    vec3.scale(point, point, r)
    return point
  })

  const cells: Array<Vec3> = [
    [3, 0, 4],
    [2, 3, 4],
    [1, 2, 4],
    [0, 1, 4],
    [3, 2, 5],
    [0, 3, 5],
    [2, 1, 5],
    [1, 0, 5],
  ] as Array<Vec3>

  const edges: Array<Vec2> = [
    [0, 1],
    [1, 2],
    [2, 3],
    [3, 0],
    [0, 4],
    [1, 4],
    [2, 4],
    [3, 4],
    [0, 5],
    [1, 5],
    [2, 5],
    [3, 5],
  ]
  return {
    positions,
    cells,
    edges,
  }
}
