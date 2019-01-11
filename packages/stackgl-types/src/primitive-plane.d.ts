// https://github.com/vorg/primitive-plane
declare module 'primitive-plane' {
  import { Mesh } from '@tstackgl/types'

  function createPlane(
    sx?: Number,
    sy?: Number,
    nx?: Number,
    ny?: Number,
    options?: { quads: boolean },
  ): Mesh

  export = createPlane
}
