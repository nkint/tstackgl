// https://github.com/hughsk/face-normals

declare module 'face-normals' {
  import { Vec3 } from '@tstackgl/types'
  function faceNormals(verts: ArrayLike<Number>, out?: Float32Array): Float32Array
  export = faceNormals
}
