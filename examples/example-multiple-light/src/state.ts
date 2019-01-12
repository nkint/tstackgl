import anime from 'animejs'
import { Vec3 } from '@tstackgl/types'
import vec3 from 'gl-vec3'
import { Atom, Cursor } from '@thi.ng/atom'
import { EventBus } from './interceptors/event-bus'
import { valueUpdater } from './interceptors/interceptors'

export const color: Vec3 = [1, 0.4, 0.0]

export const Event = {
  UPDATE_UI: 'UPDATE_UI',
  TOGGLE_PANEL_SINGLE: 'TOGGLE_PANEL_SINGLE',
  UPDATE_ANIMATION_TIME: 'UPDATE_ANIMATION_TIME',
}

const state = new Atom({
  dirty: true,
  panels: new Array(11).fill(false),
  animationTime: 0,
})

export const BUS = new EventBus(state, {
  [Event.UPDATE_UI]: [valueUpdater('dirty', () => true)],
  [Event.TOGGLE_PANEL_SINGLE]: [
    valueUpdater('panels', (panels: boolean[], id: number) => {
      const res = new Array(panels.length).fill(false)
      !panels[id] && (res[id] = true)
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
})

export const animationTime = new Cursor(BUS.state, 'animationTime')

export const dirty = new Cursor(BUS.state, 'dirty')
;(window as any).dirty = dirty

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
