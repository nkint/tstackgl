// https://github.com/mikolalysenko/angle-normals

declare module 'angle-normals' {
  import { Vec3 } from '@tstackgl/types'
  function m(cells: Vec3[], positions: Vec3[]): Vec3[]
  export = m
}
