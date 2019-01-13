import createRegl from 'regl'
import vec3 from 'gl-vec3'
import mat3 from 'gl-mat3'
import mat4 from 'gl-mat4'
import { Mesh, Vec3 } from '@tstackgl/types'

import { createUnicolor, PropsUnicolor } from './draw-unicolor'
import { createNormalMesh as createNormal, PropsNormal } from './draw-normal'
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

import { color, lightParams, LightParams } from './state'

console.log('dudee', lightParams.deref())

type CreateCommand<T> = (
  regl: createRegl.Regl,
  mesh: Mesh,
) => { draw: createRegl.DrawCommand<createRegl.DefaultContext, T> }

const unicolorProps: PropsUnicolor = {
  model: mat4.create(),
  color: vec3.create(),
}

const attenuation: PropsAttenuation = {
  color,
  ...(lightParams.deref() as LightParams).attenuation,
  lightPosition: vec3.create(),
  model: mat4.create(),
}

const normalProps: PropsNormal = {
  ...(lightParams.deref() as LightParams).normal,
  model: mat4.create(),
  normalMatrix: mat3.create(),
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
  ...(lightParams.deref() as LightParams).orenNayar,
  lightPosition: vec3.create(),
  eyePosition: vec3.create(),
  model: mat4.create(),
  normalMatrix: mat3.create(),
}

const specularPhong: PropsSpecularPhong = {
  specularColor: color,
  ambientColor: [0.08, 0.08, 0.08],
  ...(lightParams.deref() as LightParams).specularPhong,
  lightPosition: vec3.create(),
  eyePosition: vec3.create(),
  model: mat4.create(),
  normalMatrix: mat3.create(),
}

const specularBlinnPhong: PropsSpecularPhong = {
  specularColor: color,
  ambientColor: [0.08, 0.08, 0.08],
  ...(lightParams.deref() as LightParams).specularBlinnPhong,
  lightPosition: vec3.create(),
  eyePosition: vec3.create(),
  model: mat4.create(),
  normalMatrix: mat3.create(),
}

const specularWard: PropsSpecularWard = {
  specularColor: color,
  ambientColor: [0.08, 0.08, 0.08],
  ...(lightParams.deref() as LightParams).specularWard,
  lightPosition: vec3.create(),
  eyePosition: vec3.create(),
  model: mat4.create(),
  normalMatrix: mat3.create(),
}

const specularBeckmann: PropsSpecularBeckmann = {
  specularColor: color,
  ambientColor: [0.08, 0.08, 0.08],
  ...(lightParams.deref() as LightParams).specularBeckmann,
  lightPosition: vec3.create(),
  eyePosition: vec3.create(),
  model: mat4.create(),
  normalMatrix: mat3.create(),
}

const specularGaussian: PropsSpecularGaussian = {
  specularColor: color,
  ambientColor: [0.08, 0.08, 0.08],
  ...(lightParams.deref() as LightParams).specularGaussian,
  lightPosition: vec3.create(),
  eyePosition: vec3.create(),
  model: mat4.create(),
  normalMatrix: mat3.create(),
}

const specularCookTorrance: PropsSpecularCookTorrance = {
  specularColor: color,
  ambientColor: [0.08, 0.08, 0.08],
  ...(lightParams.deref() as LightParams).specularCookTorrance,
  lightPosition: vec3.create(),
  eyePosition: vec3.create(),
  model: mat4.create(),
  normalMatrix: mat3.create(),
}

export const createCommandAndProps: Array<{
  create: CreateCommand<any>
  props: {}
  name: string
  path: string
}> = [
  { path: 'unicolor', name: 'Unicolor', create: createUnicolor, props: unicolorProps },
  {
    path: 'attenuation',
    name: 'Light attenuation',
    create: createAttenuation,
    props: attenuation,
  },
  { path: 'normal', name: 'Normals', create: createNormal, props: normalProps },
  {
    path: 'lambert',
    name: 'Diffuse Lambert',
    create: createDiffuseLambert,
    props: lambertProps,
  },
  {
    path: 'orenNayar',
    name: 'Diffuse Oren Nayar',
    create: createDiffuseOrenNayar,
    props: orenNayar,
  },
  {
    path: 'specularPhong',
    name: 'Specular Phong',
    create: createSpecularPhong,
    props: specularPhong,
  },
  {
    path: 'specularBlinnPhong',
    name: 'Specular Blinn Phong',
    create: createSpecularBlinnPhong,
    props: specularBlinnPhong,
  },
  {
    path: 'specularWard',
    name: 'Specular Ward',
    create: createSpecularWard,
    props: specularWard,
  },
  {
    path: 'specularBeckmann',
    name: 'Specular Beckmann',
    create: createSpecularBeckmann,
    props: specularBeckmann,
  },
  {
    path: 'specularGaussian',
    name: 'Specular Gaussian',
    create: createSpecularGaussian,
    props: specularGaussian,
  },
  {
    path: 'specularCookTorrance',
    name: 'Specular Cook Torrance',
    create: createSpecularCookTorrance,
    props: specularCookTorrance,
  },
]
