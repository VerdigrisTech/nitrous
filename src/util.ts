/**
 * @packageDocumentation
 * @module @verdigris/nitrous/util
 */

type List<T> = ArrayLike<T>;
type Many<T> = T | ReadonlyArray<T>;

export function flatten<T>(array: List<Many<T>>, result: T[] = []): T[] {
  for (let i = 0, length = array.length; i < length; i++) {
    const value = array[i];
    if (Array.isArray(value)) {
      flatten(value, result);
    } else {
      result.push(value as T);
    }
  }
  return result;
}
