// https://github.com/mikolalysenko/bound-points

declare module 'bound-points' {
  function findBounds<T>(input: ArrayLike<T>): [T, T]
  export = findBounds
}
