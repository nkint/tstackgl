import createRegl from 'regl'

export function createFrameCatch(regl: createRegl.Regl) {
  return function frameCatch(func: (n: any) => void) {
    const loop = regl.frame((...args) => {
      try {
        func(...args)
      } catch (err) {
        loop.cancel()
        throw err
      }
    })
    return loop
  }
}
