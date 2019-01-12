import createRegl from 'regl'
import vec3 from 'gl-vec3'
import mat3 from 'gl-mat3'
import mat4 from 'gl-mat4'
import { Mesh, Vec3 } from '@tstackgl/types'

import { createUnicolor } from './draw-unicolor'
import { createNormalMesh as createNormal } from './draw-normal'
import { createDiffuseLambert, PropsDiffuseLambert } from './draw-diffuse-lambert'
import { createDiffuseOrenNayar, PropsDiffuseOrenNayar } from './draw-diffuse-oren-nayar'
import { PropsSpecularPhong, createSpecularPhong } from './draw-specular-phong'
import { createSpecularBlinnPhong } from './draw-specular-blinn-phong'
import { createAttenuation, PropsAttenuation } from './draw-attenuation'
import { createSpecularWard, PropsSpecularWard } from './draw-specular-ward'
import { createSpecularBeckmann, PropsSpecularBeckmann } from './draw-specular-beckmann'
import { createSpecularGaussian, PropsSpecularGaussian } from './draw-specular-gaussian'
import {
  createSpecularCookTorrance,
  PropsSpecularCookTorrance,
} from './draw-specular-cook-torrance'

import { lightPosition, color } from './state'

type CreateCommand<T> = (
  regl: createRegl.Regl,
  mesh: Mesh,
) => { draw: createRegl.DrawCommand<createRegl.DefaultContext, T> }

const attenuation: PropsAttenuation = {
  radius: 25,
  falloff: 0.5,
  color,
  lightPosition: vec3.create(),
  model: mat4.create(),
}

const lambertProps: PropsDiffuseLambert = {
  diffuseColor: color,
  ambientColor: [0.08, 0.08, 0.08],
  lightPosition: vec3.create(),
  model: mat4.create(),
  normalMatrix: mat3.create(),
}

const orenNayar: PropsDiffuseOrenNayar = {
  diffuseColor: color,
  ambientColor: [0.08, 0.08, 0.08],
  roughness: 0.3,
  albedo: 0.9,

  lightPosition: vec3.create(),
  eyePosition: vec3.create(),
  model: mat4.create(),
  normalMatrix: mat3.create(),
}

const specularPhong: PropsSpecularPhong = {
  specularColor: color,
  ambientColor: [0.08, 0.08, 0.08],
  shiness: 0.3,

  lightPosition: vec3.create(),
  eyePosition: vec3.create(),
  model: mat4.create(),
  normalMatrix: mat3.create(),
}

const specularBlinnPhong: PropsSpecularPhong = {
  specularColor: color,
  ambientColor: [0.08, 0.08, 0.08],
  shiness: 0.3,

  lightPosition: vec3.create(),
  eyePosition: vec3.create(),
  model: mat4.create(),
  normalMatrix: mat3.create(),
}

const specularWard: PropsSpecularWard = {
  specularColor: color,
  ambientColor: [0.08, 0.08, 0.08],
  shinyPar: 0.1,
  shinyPerp: 0.3,

  lightPosition: vec3.create(),
  eyePosition: vec3.create(),
  model: mat4.create(),
  normalMatrix: mat3.create(),
}

const specularBeckmann: PropsSpecularBeckmann = {
  specularColor: color,
  ambientColor: [0.08, 0.08, 0.08],
  roughness: 0.3,

  lightPosition: vec3.create(),
  eyePosition: vec3.create(),
  model: mat4.create(),
  normalMatrix: mat3.create(),
}

const specularGaussian: PropsSpecularGaussian = {
  specularColor: color,
  ambientColor: [0.08, 0.08, 0.08],
  shiness: 0.4,

  lightPosition: vec3.create(),
  eyePosition: vec3.create(),
  model: mat4.create(),
  normalMatrix: mat3.create(),
}

const specularCookTorrance: PropsSpecularCookTorrance = {
  specularColor: color,
  ambientColor: [0.08, 0.08, 0.08],
  roughness: 0.4,
  fresnel: 1.0,

  lightPosition: vec3.create(),
  eyePosition: vec3.create(),
  model: mat4.create(),
  normalMatrix: mat3.create(),
}

export const createCommandAndProps: Array<{
  create: CreateCommand<any>
  props: {}
  name: string
}> = [
  { name: 'Unicolor', create: createUnicolor, props: { color } },
  { name: 'Light attenuation', create: createAttenuation, props: attenuation },
  { name: 'Normals', create: createNormal, props: {} },
  { name: 'Diffuse Lambert', create: createDiffuseLambert, props: lambertProps },
  {
    name: 'Diffuse Oren Nayar',
    create: createDiffuseOrenNayar,
    props: orenNayar,
  },
  { name: 'Specular Phong', create: createSpecularPhong, props: specularPhong },
  { name: 'Specular Blinn Phong', create: createSpecularBlinnPhong, props: specularBlinnPhong },
  { name: 'Specular Ward', create: createSpecularWard, props: specularWard },
  { name: 'Specular Beckmann', create: createSpecularBeckmann, props: specularBeckmann },
  { name: 'Specular Gaussian', create: createSpecularGaussian, props: specularGaussian },
  {
    name: 'Specular Cook Torrance',
    create: createSpecularCookTorrance,
    props: specularCookTorrance,
  },
]
