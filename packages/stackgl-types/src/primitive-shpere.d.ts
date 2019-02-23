// https://github.com/glo-js/primitive-sphere

declare module 'primitive-sphere' {
  import { Mesh } from '@tstackgl/types'

  function createIcosphere(
    radius?: number,
    opts?: {
      segments: number
    },
  ): Mesh

  export = createIcosphere
}
