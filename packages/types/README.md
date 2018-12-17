## Internal data structure types

## NOTE:

- `number[] | Float32Array` : https://github.com/pjoe/gl-matrix-ts/blob/master/src/common.ts

- as class `extends Float32Array` like https://github.com/DefinitelyTyped/DefinitelyTyped/blob/master/types/gl-matrix/index.d.ts

- idea from umbrella:

```ts
export type Vec = number[] | Float32Array

export function* $iter(buf: Vec, n: number, i = 0, s = 1) {
  for (; n > 0; n--, i += s) {
    yield buf[i]
  }
}

export class Vec2 {
  buf: Vec
  x: number
  y: number
  [id: number]: number

  constructor(buf?: Vec, index = 0) {
    this.buf = buf || [0, 0]
  }

  [Symbol.iterator]() {
    return $iter(this.buf, 2, this.x, this.y)
  }

  get length() {
    return 2
  }
}

/* this from thi.ng seems to be the better solution! */

export const declareIndices = (proto: any, props: string[]) => {
  const get = (i: number) =>
    function() {
      return this.buf[this.i + i * (this.s || 1)]
    }
  const set = (i: number) =>
    function(n: number) {
      this.buf[this.i + i * (this.s || 1)] = n
    }
  props.forEach((id, i) => {
    Object.defineProperty(proto, i, {
      get: get(i),
      set: set(i),
      enumerable: true,
    })
    Object.defineProperty(proto, id, {
      get: get(i),
      set: set(i),
      enumerable: true,
    })
  })
}

declareIndices(Vec2.prototype, ['x', 'y'])
```
