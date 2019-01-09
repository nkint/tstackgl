import createRegl from 'regl'
import vec3 from 'gl-vec3'
import mat3 from 'gl-mat3'
import mat4 from 'gl-mat4'
import { Mesh, Vec3 } from '@tstackgl/types'

import { createDrawUnicolor as createUnicolor } from './draw-unicolor'
import { createNormalMesh as createNormal } from './draw-normal'
import { createDiffuseLambert, PropsDiffuseLambert } from './draw-diffuse-lambert'
import { createDiffuseOrenNayar, PropsDiffuseOrenNayar } from './draw-diffuse-oren-nayar'
import { PropsSpecularPhong, createSpecularPhong } from './draw-specular-phong'
import { createSpecularBlinnPhong } from './draw-specular-blinn-phong'
import { createAttenuation, PropsAttenuation } from './draw-attenuation'

import { lightPosition, color } from './state'

type CreateCommand<T> = (
  regl: createRegl.Regl,
  mesh: Mesh,
) => { draw: createRegl.DrawCommand<createRegl.DefaultContext, T> }

const attenuation: PropsAttenuation = {
  radius: 25,
  falloff: 0.5,
  lightPosition: lightPosition,
  color,
  model: mat4.create(),
}

const lambertProps: PropsDiffuseLambert = {
  diffuseColor: color,
  ambientColor: [0.08, 0.08, 0.08],
  lightPosition: lightPosition,
  model: mat4.create(),
  normalMatrix: mat3.create(),
}

const orenNayar: PropsDiffuseOrenNayar = {
  diffuseColor: color,
  ambientColor: [0.08, 0.08, 0.08],
  lightPosition: lightPosition,

  roughness: 0.3,
  albedo: 0.9,
  eyePosition: vec3.create(),
  model: mat4.create(),
  normalMatrix: mat3.create(),
}

const orenNayar2: PropsDiffuseOrenNayar = {
  diffuseColor: color,
  ambientColor: [0.08, 0.08, 0.08],
  lightPosition: lightPosition,

  roughness: 0.9,
  albedo: 0.3,
  eyePosition: vec3.create(),
  model: mat4.create(),
  normalMatrix: mat3.create(),
}

const specularPhong: PropsSpecularPhong = {
  diffuseColor: color,
  ambientColor: [0.08, 0.08, 0.08],
  lightPosition: lightPosition,

  shiness: 0.3,
  eyePosition: vec3.create(),
  model: mat4.create(),
  normalMatrix: mat3.create(),
}

const specularBlinnPhong: PropsSpecularPhong = {
  diffuseColor: color,
  ambientColor: [0.08, 0.08, 0.08],
  lightPosition: lightPosition,

  shiness: 0.3,
  eyePosition: vec3.create(),
  model: mat4.create(),
  normalMatrix: mat3.create(),
}

export const createCommandAndProps: Array<{ create: CreateCommand<any>; props: {} }> = [
  { create: createUnicolor, props: { color } },
  { create: createAttenuation, props: attenuation },
  { create: createNormal, props: {} },
  {
    create: createDiffuseLambert,
    props: lambertProps,
  },
  {
    create: createDiffuseOrenNayar,
    props: orenNayar,
  },
  {
    create: createDiffuseOrenNayar,
    props: orenNayar2,
  },
  { create: createSpecularPhong, props: specularPhong },
  { create: createSpecularBlinnPhong, props: specularBlinnPhong },
]
