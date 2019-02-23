// https://github.com/thibauts/serialize-wavefront-obj

declare module 'serialize-wavefront-obj' {
  import { Vec3 } from '@tstackgl/types'

  function serialize(
    cells: Vec3[],
    positions: Vec3[],
    vertexNormals: Vec3[],
    vertexUVs?: Vec3[],
    faceNormals?: Vec3[],
    faceUVs?: Vec3[],
    name?: string,
  ): string

  export = serialize
}
