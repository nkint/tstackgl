import normals = require('angle-normals')
import { Mesh } from '@tstackgl/types'
import { Vec2 } from '@tstackgl/types'

/*

TODO:
- angle normals definition
- uv

*/

const defaultOption = {
  scale: 1,
  height: 1,
  skew: [0, 0] as Vec2,
}

function geoPyramid(option: { scale?: number; height?: number; skew?: Vec2 }) {
  const geo: Mesh = {
    positions: [],
    cells: [],
    normals: [],
  }

  option = {
    ...defaultOption,
    ...option,
  }

  const scale = option.scale
  const height = option.height
  const skew = option.skew

  geo.positions = [
    // base
    [-scale, -scale, 0],
    [-scale, scale, 0],
    [scale, scale, 0],
    [scale, -scale, 0],
    // faces
    [-scale, scale, 0],
    [-scale, -scale, 0],
    [skew[0], skew[1], height],

    [scale, scale, 0],
    [-scale, scale, 0],
    [skew[0], skew[1], height],

    [scale, -scale, 0],
    [scale, scale, 0],
    [skew[0], skew[1], height],

    [-scale, -scale, 0],
    [scale, -scale, 0],
    [skew[0], skew[1], height],
  ]

  geo.cells = [
    // base
    [0, 1, 2],
    [2, 3, 0],
    // faces
    [4, 5, 6],
    [7, 8, 9],
    [10, 11, 12],
    [13, 14, 15],
  ]

  geo.normals = normals(geo.cells, geo.positions)

  return geo
}

export default geoPyramid
