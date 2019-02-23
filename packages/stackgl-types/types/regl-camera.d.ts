// https://github.com/regl-project/regl-camera

declare module 'regl-camera' {
  function createCamera(
    regl: any,
    opts: {
      distance: number
      phi: number
      theta: number
    },
  ): (input: any) => void

  export = createCamera
}
