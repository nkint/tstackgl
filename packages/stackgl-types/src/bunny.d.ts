// https://github.com/mikolalysenko/bunny

declare module 'bunny' {
  import { Vec3 } from '@tstackgl/types'

  const b: {
    positions: Array<Vec3>
    cells: Array<Vec3>
  }
  export = b
}
