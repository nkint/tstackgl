import { wrap } from '@thi.ng/transducers/iter/wrap'
import { partition } from '@thi.ng/transducers/xform/partition'

export function polygonToSegments<T>(array: Iterable<T>): IterableIterator<[T, T]> {
  return partition(2, 1, wrap(array, 1, false, true)) as IterableIterator<[T, T]>
}
