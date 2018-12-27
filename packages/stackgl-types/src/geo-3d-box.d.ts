// https://github.com/gregtatum/geo-3d-box
declare module 'geo-3d-box' {
  import { Mesh, Vec3 } from '@tstackgl/types'

  function createBox(opts?: { size?: number | Vec3; segments?: number | Vec3 }): Mesh

  export = createBox
}
