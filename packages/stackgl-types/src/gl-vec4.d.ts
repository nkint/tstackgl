declare module 'gl-vec4' {
  import { Vec4, Mat4, Quat } from '@tstackgl/types'

  /* 
Adds two Vec4's

@param {Vec4} out the receiving vector
@param {Vec4} a the first operand
@param {Vec4} b the second operand
@returns {Vec4} out 
*/
  export function add(out: Vec4, a: Vec4, b: Vec4): Vec4

  /* 
Creates a new Vec4 initialized with values from an existing vector

@param {Vec4} a vector to clone
@returns {Vec4} a new 4D vector 
*/
  export function clone(a: Vec4): Vec4

  /* 
Copy the values from one Vec4 to another

@param {Vec4} out the receiving vector
@param {Vec4} a the source vector
@returns {Vec4} out 
*/
  export function copy(out: Vec4, a: Vec4): Vec4

  /* 
Creates a new, empty Vec4

@returns {Vec4} a new 4D vector 
*/
  export function create(): Vec4

  /* 
Calculates the euclidian distance between two Vec4's

@param {Vec4} a the first operand
@param {Vec4} b the second operand
@returns {Number} distance between a and b 
*/
  export function distance(a: Vec4, b: Vec4): Number

  /* 
Divides two Vec4's

@param {Vec4} out the receiving vector
@param {Vec4} a the first operand
@param {Vec4} b the second operand
@returns {Vec4} out 
*/
  export function divide(out: Vec4, a: Vec4, b: Vec4): Vec4

  /* 
Calculates the dot product of two Vec4's

@param {Vec4} a the first operand
@param {Vec4} b the second operand
@returns {Number} dot product of a and b 
*/
  export function dot(a: Vec4, b: Vec4): Number

  /* 
Creates a new Vec4 initialized with the given values

@param {Number} x X component
@param {Number} y Y component
@param {Number} z Z component
@param {Number} w W component
@returns {Vec4} a new 4D vector 
*/
  export function fromValues(x: Number, y: Number, z: Number, w: Number): Vec4

  /* 
Returns the inverse of the components of a Vec4

@param {Vec4} out the receiving vector
@param {Vec4} a vector to invert
@returns {Vec4} out 
*/
  export function inverse(out: Vec4, a: Vec4): Vec4

  /* 
Calculates the length of a Vec4

@param {Vec4} a vector to calculate length of
@returns {Number} length of a 
*/
  export function length(a: Vec4): Number

  /* 
Performs a linear interpolation between two Vec4's

@param {Vec4} out the receiving vector
@param {Vec4} a the first operand
@param {Vec4} b the second operand
@param {Number} t interpolation amount between the two inputs
@returns {Vec4} out 
*/
  export function lerp(out: Vec4, a: Vec4, b: Vec4, t: Number): Vec4

  /* 
Returns the maximum of two Vec4's

@param {Vec4} out the receiving vector
@param {Vec4} a the first operand
@param {Vec4} b the second operand
@returns {Vec4} out 
*/
  export function max(out: Vec4, a: Vec4, b: Vec4): Vec4

  /* 
Returns the minimum of two Vec4's

@param {Vec4} out the receiving vector
@param {Vec4} a the first operand
@param {Vec4} b the second operand
@returns {Vec4} out 
*/
  export function min(out: Vec4, a: Vec4, b: Vec4): Vec4

  /* 
Multiplies two Vec4's

@param {Vec4} out the receiving vector
@param {Vec4} a the first operand
@param {Vec4} b the second operand
@returns {Vec4} out 
*/
  export function multiply(out: Vec4, a: Vec4, b: Vec4): Vec4

  /* 
Negates the components of a Vec4

@param {Vec4} out the receiving vector
@param {Vec4} a vector to negate
@returns {Vec4} out 
*/
  export function negate(out: Vec4, a: Vec4): Vec4

  /* 
Normalize a Vec4

@param {Vec4} out the receiving vector
@param {Vec4} a vector to normalize
@returns {Vec4} out 
*/
  export function normalize(out: Vec4, a: Vec4): Vec4

  /* 
Generates a random vector with the given scale

@param {Vec4} out the receiving vector
@param {Number} [scale] Length of the resulting vector. If ommitted, a unit vector will be returned
@returns {Vec4} out 
*/
  export function random(out: Vec4, scale: Number): Vec4

  /* 
Scales a Vec4 by a scalar number

@param {Vec4} out the receiving vector
@param {Vec4} a the vector to scale
@param {Number} b amount to scale the vector by
@returns {Vec4} out 
*/
  export function scale(out: Vec4, a: Vec4, b: Number): Vec4

  /* 
Adds two Vec4's after scaling the second operand by a scalar value

@param {Vec4} out the receiving vector
@param {Vec4} a the first operand
@param {Vec4} b the second operand
@param {Number} scale the amount to scale b by before adding
@returns {Vec4} out 
*/
  export function scaleAndAdd(out: Vec4, a: Vec4, b: Vec4, scale: Number): Vec4

  /* 
Set the components of a Vec4 to the given values

@param {Vec4} out the receiving vector
@param {Number} x X component
@param {Number} y Y component
@param {Number} z Z component
@param {Number} w W component
@returns {Vec4} out 
*/
  export function set(out: Vec4, x: Number, y: Number, z: Number, w: Number): Vec4

  /* 
Calculates the squared euclidian distance between two Vec4's

@param {Vec4} a the first operand
@param {Vec4} b the second operand
@returns {Number} squared distance between a and b 
*/
  export function squaredDistance(a: Vec4, b: Vec4): Number

  /* 
Calculates the squared length of a Vec4

@param {Vec4} a vector to calculate squared length of
@returns {Number} squared length of a 
*/
  export function squaredLength(a: Vec4): Number

  /* 
Subtracts vector b from vector a

@param {Vec4} out the receiving vector
@param {Vec4} a the first operand
@param {Vec4} b the second operand
@returns {Vec4} out 
*/
  export function subtract(out: Vec4, a: Vec4, b: Vec4): Vec4

  /* 
Transforms the Vec4 with a mat4.

@param {Vec4} out the receiving vector
@param {Vec4} a the vector to transform
@param {mat4} m matrix to transform with
@returns {Vec4} out 
*/
  export function transformMat4(out: Vec4, a: Vec4, m: Mat4): Vec4

  /* 
Transforms the Vec4 with a quat

@param {Vec4} out the receiving vector
@param {Vec4} a the vector to transform
@param {quat} q quaternion to transform with
@returns {Vec4} out 
*/
  export function transformQuat(out: Vec4, a: Vec4, q: Quat): Vec4
}
