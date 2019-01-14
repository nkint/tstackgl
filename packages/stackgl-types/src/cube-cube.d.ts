// https://github.com/hughsk/cube-cube

declare module 'cube-cube' {
  import { Vec3, Mesh } from '@tstackgl/types'

  function c(
    w: Number,
    h: Number,
    d: Number,
    filter?: (x: Number, y: Number, z: Number) => Boolean,
  ): Array<Mesh & { centroid: Vec3; index: Vec3 }>
  export = c
}
