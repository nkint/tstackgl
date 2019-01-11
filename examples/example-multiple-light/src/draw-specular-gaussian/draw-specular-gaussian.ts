import createRegl from 'regl'
import { Vec3, Mesh, Mat3, Mat4 } from '@tstackgl/types'

import vert from './specular-gaussian.vert'
import frag from './specular-gaussian.frag'

//------------------------------------------- props

interface PropsGeometry {
  model: Mat4
  normalMatrix: Mat3
}

interface PropsLight {
  eyePosition: Vec3
  lightPosition: Vec3

  specularColor: Vec3
  ambientColor: Vec3

  shiness: Number
}

export type PropsSpecularGaussian = PropsGeometry & PropsLight

//------------------------------------------- uniforms

interface Uniforms extends PropsSpecularGaussian {}

//------------------------------------------- attributes

interface Attributes {
  position: Array<Vec3>
  normal: Array<Vec3>
}

//------------------------------------------- regl draw command

export function createSpecularGaussian(regl: createRegl.Regl, mesh: Mesh) {
  const draw = regl<Uniforms, Attributes, PropsSpecularGaussian>({
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
      specularColor: regl.prop<PropsLight, 'specularColor'>('specularColor'),
      ambientColor: regl.prop<PropsLight, 'ambientColor'>('ambientColor'),
      shiness: regl.prop<PropsLight, 'shiness'>('shiness'),
    },

    elements: () => mesh.cells,
  })

  return { draw }
}
