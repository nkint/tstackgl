// https://github.com/glo-js/primitive-torus
declare module 'primitive-torus' {
  import { Mesh } from '@tstackgl/types'

  function createTorus(opt?: {
    majorRadius?: number
    minorRadius?: number
    majorSegments?: number
    minorSegments?: number
    arc?: number
  }): Mesh

  export = createTorus
}
