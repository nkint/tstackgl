// https://github.com/mikolalysenko/convex-hull
declare module 'convex-hull' {
  function hull<T>(points: Array<T>): Array<T>
  export = hull
}
