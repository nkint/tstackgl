import createRegl from 'regl'
import { Vec3, Mesh, Mat3, Mat4 } from '@tstackgl/types'

import vert from './diffuse-oren-nayar.vert'
import frag from './diffuse-oren-nayar.frag'

//------------------------------------------- props

interface PropsGeometry {
  model: Mat4
  normalMatrix: Mat3
}

interface PropsLight {
  eyePosition: Vec3
  lightPosition: Vec3

  diffuseColor: Vec3
  ambientColor: Vec3

  roughness: Number
  albedo: Number
}

export type PropsDiffuseOrenNayar = PropsGeometry & PropsLight

//------------------------------------------- uniforms

interface Uniforms extends PropsDiffuseOrenNayar {}

//------------------------------------------- attributes

interface Attributes {
  position: Array<Vec3>
  normal: Array<Vec3>
}

//------------------------------------------- regl draw command

export function createDiffuseOrenNayar(regl: createRegl.Regl, mesh: Mesh) {
  const draw = regl<Uniforms, Attributes, PropsDiffuseOrenNayar>({
    vert,
    frag,

    attributes: {
      position: mesh.positions,
      normal: mesh.normals,
    },

    uniforms: {
      model: regl.prop<PropsGeometry, 'model'>('model'),
      normalMatrix: regl.prop<PropsGeometry, 'normalMatrix'>('normalMatrix'),

      eyePosition: regl.prop<PropsLight, 'eyePosition'>('eyePosition'),
      lightPosition: regl.prop<PropsLight, 'lightPosition'>('lightPosition'),
      diffuseColor: regl.prop<PropsLight, 'diffuseColor'>('diffuseColor'),
      ambientColor: regl.prop<PropsLight, 'ambientColor'>('ambientColor'),
      roughness: regl.prop<PropsLight, 'roughness'>('roughness'),
      albedo: regl.prop<PropsLight, 'albedo'>('albedo'),
    },

    elements: () => mesh.cells,
  })

  return { draw }
}
