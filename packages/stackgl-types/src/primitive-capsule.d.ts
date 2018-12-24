// https://github.com/vorg/primitive-capsule
declare module 'primitive-capsule' {
  import { Mesh } from '@tstackgl/types'

  function createCapsule(r?: number, h?: number, n?: number): Mesh

  export = createCapsule
}
