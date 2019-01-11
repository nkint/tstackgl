import createRegl from 'regl'
import { Vec3, Mesh, Mat3, Mat4 } from '@tstackgl/types'

import vert from './specular-cook-torrance.vert'
import frag from './specular-cook-torrance.frag'

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
  fresnel: Number
}

export type PropsSpecularCookTorrance = PropsGeometry & PropsLight

//------------------------------------------- uniforms

interface Uniforms extends PropsSpecularCookTorrance {}

//------------------------------------------- attributes

interface Attributes {
  position: Array<Vec3>
  normal: Array<Vec3>
}

//------------------------------------------- regl draw command

export function createSpecularCookTorrance(regl: createRegl.Regl, mesh: Mesh) {
  const draw = regl<Uniforms, Attributes, PropsSpecularCookTorrance>({
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
      fresnel: regl.prop<PropsLight, 'fresnel'>('fresnel'),
    },

    elements: () => mesh.cells,
  })

  return { draw }
}
