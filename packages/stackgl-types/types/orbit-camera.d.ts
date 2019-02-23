// https://github.com/mikolalysenko/orbit-camera

declare module 'orbit-camera' {
  import { Vec3, Vec2, Mat4, Quat } from '@tstackgl/types'

  type CameraInstance = {
    lookAt: (eye: Vec3, center: Vec3, up: Vec3) => void
    pan: (translation: Vec3) => void
    rotate: (cur: Vec2, prev: Vec2) => void
    zoom: (delta: number) => void
    view: (out?: Mat4) => Mat4

    rotation: Quat
    distance: Number
  }
  function c(eye: Vec3, center: Vec3, up: Vec3): CameraInstance

  export = c
}
