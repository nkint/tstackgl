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
import { createSpecularWard, PropsSpecularWard } from './draw-specular-ward'
import { createSpecularBeckmann, PropsSpecularBeckmann } from './draw-specular-beckmann'
import { createSpecularGaussian, PropsSpecularGaussian } from './draw-specular-gaussian'
import {
  createSpecularCookTorrance,
  PropsSpecularCookTorrance,
} from './draw-specular-cook-torrance'

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

const specularWard: PropsSpecularWard = {
  diffuseColor: color,
  ambientColor: [0.08, 0.08, 0.08],
  lightPosition: lightPosition,
  shinyPar: 0.1,
  shinyPerp: 0.3,

  eyePosition: vec3.create(),
  model: mat4.create(),
  normalMatrix: mat3.create(),
}

const specularBeckmann: PropsSpecularBeckmann = {
  diffuseColor: color,
  ambientColor: [0.08, 0.08, 0.08],
  lightPosition: lightPosition,
  roughness: 0.3,

  eyePosition: vec3.create(),
  model: mat4.create(),
  normalMatrix: mat3.create(),
}

const specularGaussian: PropsSpecularGaussian = {
  diffuseColor: color,
  ambientColor: [0.08, 0.08, 0.08],
  lightPosition: lightPosition,
  shiness: 0.4,

  eyePosition: vec3.create(),
  model: mat4.create(),
  normalMatrix: mat3.create(),
}

const specularCookTorrance: PropsSpecularCookTorrance = {
  diffuseColor: color,
  ambientColor: [0.08, 0.08, 0.08],
  lightPosition: lightPosition,
  roughness: 0.4,
  fresnel: 1.0,

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
  { create: createSpecularPhong, props: specularPhong },
  { create: createSpecularBlinnPhong, props: specularBlinnPhong },
  { create: createSpecularWard, props: specularWard },
  { create: createSpecularBeckmann, props: specularBeckmann },
  { create: createSpecularGaussian, props: specularGaussian },
  { create: createSpecularCookTorrance, props: specularCookTorrance },
]
