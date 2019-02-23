declare module 'gl-vec2' {
  import { Vec2, Vec3, Mat2, Mat3, Mat4 } from '@tstackgl/types'

  /**
   * Creates a new, empty Vec2
   *
   * @returns a new 2D vector
   */
  export function create(): Vec2

  /**
   * Adds two Vec2's
   *
   * @param out the receiving vector
   * @param a the first operand
   * @param b the second operand
   * @returns out
   */
  export function add(out: Vec2, a: Vec2, b: Vec2): Vec2

  /**
   * Set the components of a Vec2 to the given values
   *
   * @param out the receiving vector
   * @param x X component
   * @param y Y component
   * @returns out
   */
  export function set(out: Vec2, x: number, y: number): Vec2

  /**
   * Copy the values from one Vec2 to another
   *
   * @param out the receiving vector
   * @param a the source vector
   * @returns out
   */
  export function copy(out: Vec2, a: Vec2 | number[]): Vec2

  /**
   * Normalize a Vec2
   *
   * @param out the receiving vector
   * @param a vector to normalize
   * @returns out
   */
  export function normalize(out: Vec2, a: Vec2 | number[]): Vec2

  /**
   * Multiplies two Vec2's
   *
   * @param out the receiving vector
   * @param a the first operand
   * @param b the second operand
   * @returns out
   */
  export function multiply(out: Vec2, a: Vec2 | number[], b: Vec2 | number[]): Vec2

  /**
   * Multiplies two Vec2's
   *
   * @param out the receiving vector
   * @param a the first operand
   * @param b the second operand
   * @returns out
   */
  export function mul(out: Vec2, a: Vec2 | number[], b: Vec2 | number[]): Vec2

  /**
   * Creates a new Vec2 initialized with values from an existing vector
   *
   * @param a a vector to clone
   * @returns a new 2D vector
   */
  export function clone(a: Vec2 | number[]): Vec2

  /**
   * Creates a new Vec2 initialized with the given values
   *
   * @param x X component
   * @param y Y component
   * @returns a new 2D vector
   */
  export function fromValues(x: number, y: number): Vec2

  /**
   * Subtracts vector b from vector a
   *
   * @param out the receiving vector
   * @param a the first operand
   * @param b the second operand
   * @returns out
   */
  export function subtract(out: Vec2, a: Vec2 | number[], b: Vec2 | number[]): Vec2

  /**
   * Subtracts vector b from vector a
   *
   * @param out the receiving vector
   * @param a the first operand
   * @param b the second operand
   * @returns out
   */
  export function sub(out: Vec2, a: Vec2 | number[], b: Vec2 | number[]): Vec2

  /**
   * Multiplies two Vec2's
   *
   * @param out the receiving vector
   * @param a the first operand
   * @param b the second operand
   * @returns out
   */
  export function mul(out: Vec2, a: Vec2 | number[], b: Vec2 | number[]): Vec2

  /**
   * Divides two Vec2's
   *
   * @param out the receiving vector
   * @param a the first operand
   * @param b the second operand
   * @returns out
   */
  export function divide(out: Vec2, a: Vec2 | number[], b: Vec2 | number[]): Vec2

  /**
   * Divides two Vec2's
   *
   * @param out the receiving vector
   * @param a the first operand
   * @param b the second operand
   * @returns out
   */
  export function div(out: Vec2, a: Vec2 | number[], b: Vec2 | number[]): Vec2

  /**
   * Math.ceil the components of a Vec2
   *
   * @param {Vec2} out the receiving vector
   * @param {Vec2} a vector to ceil
   * @returns {Vec2} out
   */
  export function ceil(out: Vec2, a: Vec2 | number[]): Vec2

  /**
   * Math.floor the components of a Vec2
   *
   * @param {Vec2} out the receiving vector
   * @param {Vec2} a vector to floor
   * @returns {Vec2} out
   */
  export function floor(out: Vec2, a: Vec2 | number[]): Vec2

  /**
   * Returns the minimum of two Vec2's
   *
   * @param out the receiving vector
   * @param a the first operand
   * @param b the second operand
   * @returns out
   */
  export function min(out: Vec2, a: Vec2 | number[], b: Vec2 | number[]): Vec2

  /**
   * Returns the maximum of two Vec2's
   *
   * @param out the receiving vector
   * @param a the first operand
   * @param b the second operand
   * @returns out
   */
  export function max(out: Vec2, a: Vec2 | number[], b: Vec2 | number[]): Vec2

  /**
   * Math.round the components of a Vec2
   *
   * @param {Vec2} out the receiving vector
   * @param {Vec2} a vector to round
   * @returns {Vec2} out
   */
  export function round(out: Vec2, a: Vec2 | number[]): Vec2

  /**
   * Scales a Vec2 by a scalar number
   *
   * @param out the receiving vector
   * @param a the vector to scale
   * @param b amount to scale the vector by
   * @returns out
   */
  export function scale(out: Vec2, a: Vec2 | number[], b: number): Vec2

  /**
   * Adds two Vec2's after scaling the second operand by a scalar value
   *
   * @param out the receiving vector
   * @param a the first operand
   * @param b the second operand
   * @param scale the amount to scale b by before adding
   * @returns out
   */
  export function scaleAndAdd(
    out: Vec2,
    a: Vec2 | number[],
    b: Vec2 | number[],
    scale: number,
  ): Vec2

  /**
   * Calculates the euclidian distance between two Vec2's
   *
   * @param a the first operand
   * @param b the second operand
   * @returns distance between a and b
   */
  export function distance(a: Vec2 | number[], b: Vec2 | number[]): number

  /**
   * Calculates the euclidian distance between two Vec2's
   *
   * @param a the first operand
   * @param b the second operand
   * @returns distance between a and b
   */
  export function dist(a: Vec2 | number[], b: Vec2 | number[]): number

  /**
   * Calculates the squared euclidian distance between two Vec2's
   *
   * @param a the first operand
   * @param b the second operand
   * @returns squared distance between a and b
   */
  export function squaredDistance(a: Vec2 | number[], b: Vec2 | number[]): number

  /**
   * Calculates the squared euclidian distance between two Vec2's
   *
   * @param a the first operand
   * @param b the second operand
   * @returns squared distance between a and b
   */
  export function sqrDist(a: Vec2 | number[], b: Vec2 | number[]): number

  /**
   * Calculates the length of a Vec2
   *
   * @param a vector to calculate length of
   * @returns length of a
   */
  export function length(a: Vec2 | number[]): number

  /**
   * Calculates the length of a Vec2
   *
   * @param a vector to calculate length of
   * @returns length of a
   */
  export function len(a: Vec2 | number[]): number

  /**
   * Calculates the squared length of a Vec2
   *
   * @param a vector to calculate squared length of
   * @returns squared length of a
   */
  export function squaredLength(a: Vec2 | number[]): number

  /**
   * Calculates the squared length of a Vec2
   *
   * @param a vector to calculate squared length of
   * @returns squared length of a
   */
  export function sqrLen(a: Vec2 | number[]): number

  /**
   * Negates the components of a Vec2
   *
   * @param out the receiving vector
   * @param a vector to negate
   * @returns out
   */
  export function negate(out: Vec2, a: Vec2 | number[]): Vec2

  /**
   * Returns the inverse of the components of a Vec2
   *
   * @param out the receiving vector
   * @param a vector to invert
   * @returns out
   */
  export function inverse(out: Vec2, a: Vec2 | number[]): Vec2

  /**
   * Calculates the dot product of two Vec2's
   *
   * @param a the first operand
   * @param b the second operand
   * @returns dot product of a and b
   */
  export function dot(a: Vec2 | number[], b: Vec2 | number[]): number

  /**
   * Computes the cross product of two Vec2's
   * Note that the cross product must by definition produce a 3D vector
   *
   * @param out the receiving vector
   * @param a the first operand
   * @param b the second operand
   * @returns out
   */
  export function cross(out: Vec3, a: Vec2 | number[], b: Vec2 | number[]): Vec2

  /**
   * Performs a linear interpolation between two Vec2's
   *
   * @param out the receiving vector
   * @param a the first operand
   * @param b the second operand
   * @param t interpolation amount between the two inputs
   * @returns out
   */
  export function lerp(out: Vec2, a: Vec2 | number[], b: Vec2 | number[], t: number): Vec2

  /**
   * Generates a random unit vector
   *
   * @param out the receiving vector
   * @returns out
   */
  export function random(out: Vec2): Vec2

  /**
   * Generates a random vector with the given scale
   *
   * @param out the receiving vector
   * @param scale Length of the resulting vector. If ommitted, a unit vector will be returned
   * @returns out
   */
  export function random(out: Vec2, scale: number): Vec2

  /**
   * Transforms the Vec2 with a mat2
   *
   * @param out the receiving vector
   * @param a the vector to transform
   * @param m matrix to transform with
   * @returns out
   */
  export function transformMat2(out: Vec2, a: Vec2 | number[], m: Mat2): Vec2

  // /**
  //  * Transforms the Vec2 with a mat2d
  //  *
  //  * @param out the receiving vector
  //  * @param a the vector to transform
  //  * @param m matrix to transform with
  //  * @returns out
  //  */
  // export function transformMat2d(out: Vec2, a: Vec2 | number[], m: Mat2): Vec2

  /**
   * Transforms the Vec2 with a mat3
   * 3rd vector component is implicitly '1'
   *
   * @param out the receiving vector
   * @param a the vector to transform
   * @param m matrix to transform with
   * @returns out
   */
  export function transformMat3(out: Vec2, a: Vec2 | number[], m: Mat3): Vec2

  /**
   * Transforms the Vec2 with a mat4
   * 3rd vector component is implicitly '0'
   * 4th vector component is implicitly '1'
   *
   * @param out the receiving vector
   * @param a the vector to transform
   * @param m matrix to transform with
   * @returns out
   */
  export function transformMat4(out: Vec2, a: Vec2 | number[], m: Mat4): Vec2

  /**
   * Perform some operation over an array of Vec2s.
   *
   * @param a the array of vectors to iterate over
   * @param stride Number of elements between the start of each Vec2. If 0 assumes tightly packed
   * @param offset Number of elements to skip at the beginning of the array
   * @param count Number of Vec2s to iterate over. If 0 iterates over entire array
   * @param fn Function to call for each vector in the array
   * @param arg additional argument to pass to fn
   * @returns a
   */
  export function forEach(
    a: Float32Array,
    stride: number,
    offset: number,
    count: number,
    fn: (a: Vec2 | number[], b: Vec2 | number[], arg: any) => void,
    arg: any,
  ): Float32Array

  /**
   * Get the angle between two 2D vectors
   * @param a The first operand
   * @param b The second operand
   * @returns The angle in radians
   */
  export function angle(a: Vec2 | number[], b: Vec2 | number[]): number

  /**
   * Perform some operation over an array of Vec2s.
   *
   * @param a the array of vectors to iterate over
   * @param stride Number of elements between the start of each Vec2. If 0 assumes tightly packed
   * @param offset Number of elements to skip at the beginning of the array
   * @param count Number of Vec2s to iterate over. If 0 iterates over entire array
   * @param fn Function to call for each vector in the array
   * @returns a
   */
  export function forEach(
    a: Float32Array,
    stride: number,
    offset: number,
    count: number,
    fn: (a: Vec2 | number[], b: Vec2 | number[]) => void,
  ): Float32Array

  /**
   * Returns a string representation of a vector
   *
   * @param a vector to represent as a string
   * @returns string representation of the vector
   */
  export function str(a: Vec2 | number[]): string

  /**
   * Returns whether or not the vectors exactly have the same elements in the same position (when compared with ===)
   *
   * @param {Vec2} a The first vector.
   * @param {Vec2} b The second vector.
   * @returns {boolean} True if the vectors are equal, false otherwise.
   */
  export function exactEquals(a: Vec2 | number[], b: Vec2 | number[]): boolean

  /**
   * Returns whether or not the vectors have approximately the same elements in the same position.
   *
   * @param {Vec2} a The first vector.
   * @param {Vec2} b The second vector.
   * @returns {boolean} True if the vectors are equal, false otherwise.
   */
  export function equals(a: Vec2 | number[], b: Vec2 | number[]): boolean

  /**
   * Limit the magnitude of this vector to the value used for the `max`
   * parameter.
   *
   * @method limit
   * @param  {Vec2} out the vector to limit
   * @param  {Vec2} a the vector to limit
   * @param  {number} max the maximum magnitude for the vector
   * @returns {Vec2} out
   */
  export function limit(out: Vec2, a: Vec2, max: number): Vec2

  /**
   * Rotates a vec2 by an angle
   *
   * @param {Vec2} out the receiving vector
   * @param {Vec2} a the vector to rotate
   * @param {Number} angle the angle of rotation (in radians)
   * @returns {Vec2} out
   */
  export function rotate(out: Vec2, a: Vec2, angle: number): Vec2
}
