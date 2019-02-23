// https://github.com/aheckmann/sliced

declare module 'sliced' {
  function sliced<T>(arr: Array<T>, slice?: number, sliceEnd?: number): Array<T>
  export = sliced
}
