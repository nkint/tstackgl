// https://github.com/glo-js/primitive-quad
declare module 'primitive-quad' {
  import { Mesh } from '@tstackgl/types'

  function createQuad(scale?: number): Mesh

  export = createQuad
}
