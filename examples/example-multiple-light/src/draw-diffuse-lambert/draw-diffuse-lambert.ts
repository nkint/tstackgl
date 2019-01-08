import createRegl from 'regl'
import { Vec3, Mesh, Mat3, Mat4 } from '@tstackgl/types'

import vert from './diffuse-lambert.vert'
import frag from './diffuse-lambert.frag'

//------------------------------------------- props

interface PropsGeometry {
  model: Mat4
  normalMatrix: Mat3
}

interface PropsLight {
  diffuseColor: Vec3
  ambientColor: Vec3
  lightPosition: Vec3
}

export type PropsDiffuseLambert = PropsGeometry & PropsLight

//------------------------------------------- uniforms

interface Uniforms extends PropsDiffuseLambert {}

//------------------------------------------- attributes

interface Attributes {
  position: Array<Vec3>
  normal: Array<Vec3>
}

//------------------------------------------- regl draw command

export function createDiffuseLambert(regl: createRegl.Regl, mesh: Mesh) {
  const draw = regl<Uniforms, Attributes, PropsDiffuseLambert>({
    vert,
    frag,

    attributes: {
      position: mesh.positions,
      normal: mesh.normals,
    },

    uniforms: {
      model: regl.prop<PropsGeometry, 'model'>('model'),
      normalMatrix: regl.prop<PropsGeometry, 'normalMatrix'>('normalMatrix'),

      diffuseColor: regl.prop<PropsLight, 'diffuseColor'>('diffuseColor'),
      ambientColor: regl.prop<PropsLight, 'ambientColor'>('ambientColor'),
      lightPosition: regl.prop<PropsLight, 'lightPosition'>('lightPosition'),
    },

    elements: () => mesh.cells,
  })

  return { draw }
}
