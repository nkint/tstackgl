import anime from 'animejs'
import { Vec3 } from '@tstackgl/types'
import vec3 from 'gl-vec3'
import { Atom, Cursor } from '@thi.ng/atom'
import { EventBus } from './interceptors/event-bus'
import { valueUpdater } from './interceptors/interceptors'
import * as tx from '@thi.ng/transducers'

export const color: Vec3 = [1, 0.4, 0.0]

export const Event = {
  UPDATE_UI: 'UPDATE_UI',
  TOGGLE_PANEL_SINGLE: 'TOGGLE_PANEL_SINGLE',
  UPDATE_ANIMATION_TIME: 'UPDATE_ANIMATION_TIME',
  UPDATE_LIGHT_PARAM: 'UPDATE_LIGHT_PARAM',
}

const lightParamStartState = {
  unicolor: {},
  normal: {},
  lambert: {},
  attenuation: {
    radius: 25,
    falloff: 0.5,
  },
  orenNayar: {
    roughness: 0.3,
    albedo: 0.9,
  },
  specularPhong: {
    shiness: 0.3,
  },
  specularBlinnPhong: {
    shiness: 0.3,
  },
  specularWard: {
    shinyPar: 0.1,
    shinyPerp: 0.3,
  },
  specularBeckmann: {
    roughness: 0.3,
  },
  specularGaussian: {
    shiness: 0.4,
  },
  specularCookTorrance: {
    roughness: 0.4,
    fresnel: 1.0,
  },
}

export const lightParamsMinMax = {
  attenuation: {
    radius: { min: 0, max: 100, step: 0.1 },
    falloff: { min: 0, max: 1, step: 0.1 },
  },
  orenNayar: {
    roughness: { min: 0, max: 2, step: 0.1 },
    albedo: { min: 0, max: 2, step: 0.1 },
  },
  specularPhong: {
    shiness: { min: 0, max: 1, step: 0.1 },
  },
  specularBlinnPhong: {
    shiness: { min: 0, max: 1, step: 0.1 },
  },
  specularWard: {
    shinyPar: { min: 0, max: 1, step: 0.1 },
    shinyPerp: { min: 0, max: 1, step: 0.1 },
  },
  specularBeckmann: {
    roughness: { min: 0, max: 1, step: 0.1 },
  },
  specularGaussian: {
    shiness: { min: 0, max: 1, step: 0.1 },
  },
  specularCookTorrance: {
    roughness: { min: 0, max: 1, step: 0.1 },
    fresnel: { min: 0, max: 1, step: 0.1 },
  },
}

export type LightParams = typeof lightParamStartState

const state = new Atom({
  dirty: true,
  panels: new Array(11).fill(false),
  animationTime: 0,
  lightParams: lightParamStartState,
})

export const lightParams = new Cursor(state, 'lightParams')
;(window as any).lightParams = lightParams

export const animationTime = new Cursor(state, 'animationTime')

export const dirty = new Cursor(state, 'dirty')
;(window as any).dirty = dirty

export const openLightIndex = state.addView('panels', (panels: boolean[]) => {
  return panels.findIndex(x => x)
})

export const BUS = new EventBus(state, {
  [Event.UPDATE_UI]: [valueUpdater('dirty', () => true)],
  [Event.TOGGLE_PANEL_SINGLE]: [
    valueUpdater('panels', (panels: boolean[], id: number) => {
      const res = new Array(panels.length).fill(false)
      !panels[id] && (res[id] = true)
      BUS.dispatch([Event.UPDATE_UI])
      return res
    }),
  ],
  [Event.UPDATE_ANIMATION_TIME]: [
    valueUpdater('animationTime', (animationTime: Number, newAnimationTime) => {
      if (animationTime !== newAnimationTime) {
        BUS.dispatch([Event.UPDATE_UI])
      }
      return newAnimationTime
    }),
  ],
  [Event.UPDATE_LIGHT_PARAM]: [
    valueUpdater('lightParams', (param: any, { value, path, key }) => {
      lightParams.swap(x => {
        x[path][key] = value
        return x
      })
      BUS.dispatch([Event.UPDATE_UI])
      return param
    }),
  ],
})

const _lightPosition = vec3.create()
export const lightPosition = BUS.state.addView('animationTime', (t: Number) => {
  vec3.set(
    _lightPosition,
    animationObj.value * 20 - 10,
    Math.sin(Math.PI / 2 + animationObj.value * TWO_PI) * 5,
    Math.cos(Math.PI / 2 + animationObj.value * TWO_PI) * 5,
  )
  return _lightPosition
})

//------------------------------------------------------------------ light animation

const animationObj = {
  value: 0,
}

const TWO_PI = Math.PI * 2

const timeline = anime
  .timeline({
    loop: true,
    update: () => {
      if (animationTime.deref() !== animationObj.value) {
        BUS.dispatch([Event.UPDATE_ANIMATION_TIME, animationObj.value])
      }
    },
    easing: 'easeInOutSine',
  })
  .add({
    targets: animationObj,
    value: 1,
    duration: 3000,
  })
  .add({
    targets: animationObj,
    value: 1,
    duration: 2000,
  })
  .add({
    targets: animationObj,
    value: 0,
    duration: 3000,
  })
  .add({
    targets: animationObj,
    value: 0,
    duration: 2000,
  })

timeline.play()
