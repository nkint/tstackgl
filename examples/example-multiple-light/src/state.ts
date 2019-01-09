import anime from 'animejs'
import { Vec3 } from '@tstackgl/types'
import vec3 from 'gl-vec3'

export const lightPosition: Vec3 = [5, 5, 15]
export const color: Vec3 = [1, 0.4, 0.0]

const temp = {
  value: 0,
}

const TWO_PI = Math.PI * 2

const timeline = anime
  .timeline({
    loop: true,
    update: () => {
      vec3.set(
        lightPosition,
        temp.value * 20 - 10,
        Math.sin(Math.PI / 2 + temp.value * TWO_PI) * 5,
        Math.cos(Math.PI / 2 + temp.value * TWO_PI) * 5,
      )
    },
    easing: 'easeInOutSine',
  })
  .add({
    targets: temp,
    value: 1,
    duration: 3000,
  })
  .add({
    targets: temp,
    value: 1,
    duration: 2000,
  })
  .add({
    targets: temp,
    value: 0,
    duration: 3000,
  })
  .add({
    targets: temp,
    value: 0,
    duration: 2000,
  })

timeline.play()
