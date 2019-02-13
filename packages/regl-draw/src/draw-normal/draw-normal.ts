import createRegl from 'regl'
import { Vec3, Mesh } from '@tstackgl/types'
import { Mat4, Mat3 } from '@tstackgl/types/src'

import vert from './normal.vert'
import frag from './normal.frag'

// https://stackoverflow.com/questions/19728950/three-js-meshnormalmaterial-default-color
// https://stackoverflow.com/questions/47710377/how-to-implement-meshnormalmaterial-in-three-js-by-glsl#47710795

//------------------------------------------- props

interface PropsGeometry {
  model: Mat4
  normalMatrix: Mat3
}

export type PropsNormal = PropsGeometry

//------------------------------------------- uniforms

interface Uniforms extends PropsNormal {}

//------------------------------------------- uniforms

interface Attributes {
  position: Array<Vec3>
  normal: Array<Vec3>
}

export function createNormalMesh(regl: createRegl.Regl, mesh: Mesh) {
  const draw = regl<Uniforms, Attributes, PropsNormal>({
    vert,
    frag,

    attributes: {
      position: mesh.positions,
      normal: mesh.normals,
    },

    uniforms: {
      model: regl.prop<PropsGeometry, 'model'>('model'),
      normalMatrix: regl.prop<PropsGeometry, 'normalMatrix'>('normalMatrix'),
    },

    elements: () => mesh.cells,
  })

  return { draw }
}
