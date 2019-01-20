// https://github.com/hughsk/mesh-reindex

declare module 'mesh-reindex' {
  import { Vec3, Mesh } from '@tstackgl/types'

  function reindex(input: Float32Array): Mesh
  export = reindex
}
