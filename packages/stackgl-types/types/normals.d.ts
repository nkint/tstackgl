// https://github.com/mikolalysenko/normals

declare module 'normals' {
  import { Vec3 } from '@tstackgl/types'

  export function vertexNormals(cells: Vec3[], positions: Vec3[], epsilon?: number): Vec3[]
  export function faceNormals(cells: Vec3[], positions: Vec3[], epsilon?: number): Vec3[]
}
