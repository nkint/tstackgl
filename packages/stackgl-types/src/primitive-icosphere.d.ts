// https://github.com/glo-js/primitive-icosphere
declare module 'primitive-icosphere' {
  import { Mesh } from '@tstackgl/types'

  function createIcosphere(
    radius?: number,
    opts?: {
      subdivisions: number
    },
  ): Mesh

  export = createIcosphere
}
