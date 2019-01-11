/**
 * More on Ward specular:
 * https://gamedev.stackexchange.com/questions/67679/how-can-i-create-a-shader-that-will-reproduce-this-lighting-effect-on-terrain
 * http://www.cs.utah.edu/~premoze/brdf/
 *
 */

import createRegl from 'regl'
import { Vec3, Mesh, Mat3, Mat4, Vec2 } from '@tstackgl/types'

import vert from './specular-ward.vert'
import frag from './specular-ward.frag'

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

  shinyPar: Number
  shinyPerp: Number
}

export type PropsSpecularWard = PropsGeometry & PropsLight

//------------------------------------------- uniforms

interface Uniforms extends PropsSpecularWard {}

//------------------------------------------- attributes

interface Attributes {
  position: Array<Vec3>
  normal: Array<Vec3>
  uv: Array<Vec2>
}

//------------------------------------------- regl draw command

export function createSpecularWard(regl: createRegl.Regl, mesh: Mesh) {
  if (!mesh.uvs) {
    throw new Error('specular ward model need uv!')
  }

  const draw = regl<Uniforms, Attributes, PropsSpecularWard>({
    vert,
    frag,

    attributes: {
      position: mesh.positions,
      normal: mesh.normals,
      uv: mesh.uvs,
    },

    uniforms: {
      model: regl.prop<PropsGeometry, 'model'>('model'),
      normalMatrix: regl.prop<PropsGeometry, 'normalMatrix'>('normalMatrix'),

      eyePosition: regl.prop<PropsLight, 'eyePosition'>('eyePosition'),
      lightPosition: regl.prop<PropsLight, 'lightPosition'>('lightPosition'),
      diffuseColor: regl.prop<PropsLight, 'diffuseColor'>('diffuseColor'),
      ambientColor: regl.prop<PropsLight, 'ambientColor'>('ambientColor'),

      shinyPar: regl.prop<PropsLight, 'shinyPar'>('shinyPar'),
      shinyPerp: regl.prop<PropsLight, 'shinyPerp'>('shinyPerp'),
    },

    elements: () => mesh.cells,
  })

  return { draw }
}
