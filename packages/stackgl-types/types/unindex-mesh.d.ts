// https://github.com/hughsk/unindex-mesh

declare module 'unindex-mesh' {
  import { Vec3, Mesh } from '@tstackgl/types'

  function c(positions: Array<Vec3>, faces: Array<Vec3>, out?: Float32Array): Float32Array
  function c(mes: Mesh, out?: Float32Array): Float32Array
  export = c
}
