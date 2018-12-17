declare module 'gl-vec3' {
  import { Quat, Mat4, Mat3, Vec3 } from '@tstackgl/types'

  /* 
Adds two Vec3's

@param {Vec3} out the receiving vector
@param {Vec3} a the first operand
@param {Vec3} b the second operand
@returns {Vec3} out 
*/
  export function add(out: Vec3, a: Vec3, b: Vec3): Vec3

  /* 
Get the angle between two 3D vectors
@param {Vec3} a The first operand
@param {Vec3} b The second operand
@returns {number} The angle in radians 
*/
  export function angle(a: Vec3, b: Vec3): number

  /* 
Math.ceil the components of a Vec3

@param {Vec3} out the receiving vector
@param {Vec3} a vector to ceil
@returns {Vec3} out 
*/
  export function ceil(out: Vec3, a: Vec3): Vec3

  /* 
Creates a new Vec3 initialized with values from an existing vector

@param {Vec3} a vector to clone
@returns {Vec3} a new 3D vector 
*/
  export function clone(a: Vec3): Vec3

  /* 
Copy the values from one Vec3 to another

@param {Vec3} out the receiving vector
@param {Vec3} a the source vector
@returns {Vec3} out 
*/
  export function copy(out: Vec3, a: Vec3): Vec3

  /* 
Creates a new, empty Vec3

@returns {Vec3} a new 3D vector 
*/
  export function create(): Vec3

  /* 
Computes the cross product of two Vec3's

@param {Vec3} out the receiving vector
@param {Vec3} a the first operand
@param {Vec3} b the second operand
@returns {Vec3} out 
*/
  export function cross(out: Vec3, a: Vec3, b: Vec3): Vec3

  /* 
Calculates the euclidian distance between two Vec3's

@param {Vec3} a the first operand
@param {Vec3} b the second operand
@returns {number} distance between a and b 
*/
  export function dist(a: Vec3, b: Vec3): number

  /* 
Calculates the euclidian distance between two Vec3's

@param {Vec3} a the first operand
@param {Vec3} b the second operand
@returns {number} distance between a and b 
*/
  export function distance(a: Vec3, b: Vec3): number

  /* 
Divides two Vec3's

@param {Vec3} out the receiving vector
@param {Vec3} a the first operand
@param {Vec3} b the second operand
@returns {Vec3} out 
*/
  export function div(out: Vec3, a: Vec3, b: Vec3): Vec3

  /* 
Divides two Vec3's

@param {Vec3} out the receiving vector
@param {Vec3} a the first operand
@param {Vec3} b the second operand
@returns {Vec3} out 
*/
  export function divide(out: Vec3, a: Vec3, b: Vec3): Vec3

  /* 
Calculates the dot product of two Vec3's

@param {Vec3} a the first operand
@param {Vec3} b the second operand
@returns {number} dot product of a and b 
*/
  export function dot(a: Vec3, b: Vec3): number

  /* 
Returns whether or not the vectors have approximately the same elements in the same position.

@param {Vec3} a The first vector.
@param {Vec3} b The second vector.
@returns {Boolean} True if the vectors are equal, false otherwise. 
*/
  export function equals(a: Vec3, b: Vec3): Boolean

  /* 
Returns whether or not the vectors exactly have the same elements in the same position (when compared with ===)

@param {Vec3} a The first vector.
@param {Vec3} b The second vector.
@returns {Boolean} True if the vectors are equal, false otherwise. 
*/
  export function exactEquals(a: Vec3, b: Vec3): Boolean

  /* 
Math.floor the components of a Vec3

@param {Vec3} out the receiving vector
@param {Vec3} a vector to floor
@returns {Vec3} out 
*/
  export function floor(out: Vec3, a: Vec3): Vec3

  /* 
Perform some operation over an array of Vec3s.

@param {Array} a the array of vectors to iterate over
@param {number} stride number of elements between the start of each Vec3. If 0 assumes tightly packed
@param {number} offset number of elements to skip at the beginning of the array
@param {number} count number of Vec3s to iterate over. If 0 iterates over entire array
@param {Function} fn Function to call for each vector in the array
@param {Object} [arg] additional argument to pass to fn
@returns {Array} a
@function 
*/
  export function forEach(
    a: Array<Vec3>,
    stride: number,
    offset: number,
    count: number,
    fn: Function,
    arg: Object,
  ): Array<Vec3>

  /* 
Creates a new Vec3 initialized with the given values

@param {number} x X component
@param {number} y Y component
@param {number} z Z component
@returns {Vec3} a new 3D vector 
*/
  export function fromValues(x: number, y: number, z: number): Vec3

  /* 
Returns the inverse of the components of a Vec3

@param {Vec3} out the receiving vector
@param {Vec3} a vector to invert
@returns {Vec3} out 
*/
  export function inverse(out: Vec3, a: Vec3): Vec3

  /* 
Calculates the length of a Vec3

@param {Vec3} a vector to calculate length of
@returns {number} length of a 
*/
  export function len(a: Vec3): number

  /* 
Calculates the length of a Vec3

@param {Vec3} a vector to calculate length of
@returns {number} length of a 
*/
  export function length(a: Vec3): number

  /* 
Performs a linear interpolation between two Vec3's

@param {Vec3} out the receiving vector
@param {Vec3} a the first operand
@param {Vec3} b the second operand
@param {number} t interpolation amount between the two inputs
@returns {Vec3} out 
*/
  export function lerp(out: Vec3, a: Vec3, b: Vec3, t: number): Vec3

  /* 
Returns the maximum of two Vec3's

@param {Vec3} out the receiving vector
@param {Vec3} a the first operand
@param {Vec3} b the second operand
@returns {Vec3} out 
*/
  export function max(out: Vec3, a: Vec3, b: Vec3): Vec3

  /* 
Returns the minimum of two Vec3's

@param {Vec3} out the receiving vector
@param {Vec3} a the first operand
@param {Vec3} b the second operand
@returns {Vec3} out 
*/
  export function min(out: Vec3, a: Vec3, b: Vec3): Vec3

  /* 
Multiplies two Vec3's

@param {Vec3} out the receiving vector
@param {Vec3} a the first operand
@param {Vec3} b the second operand
@returns {Vec3} out 
*/
  export function mul(out: Vec3, a: Vec3, b: Vec3): Vec3

  /* 
Multiplies two Vec3's

@param {Vec3} out the receiving vector
@param {Vec3} a the first operand
@param {Vec3} b the second operand
@returns {Vec3} out 
*/
  export function multiply(out: Vec3, a: Vec3, b: Vec3): Vec3

  /* 
Negates the components of a Vec3

@param {Vec3} out the receiving vector
@param {Vec3} a vector to negate
@returns {Vec3} out 
*/
  export function negate(out: Vec3, a: Vec3): Vec3

  /* 
Normalize a Vec3

@param {Vec3} out the receiving vector
@param {Vec3} a vector to normalize
@returns {Vec3} out 
*/
  export function normalize(out: Vec3, a: Vec3): Vec3

  /* 
Generates a random vector with the given scale

@param {Vec3} out the receiving vector
@param {number} [scale] Length of the resulting vector. If ommitted, a unit vector will be returned
@returns {Vec3} out 
*/
  export function random(out: Vec3, scale: number): Vec3

  /* 
Rotate a 3D vector around the x-axis
@param {Vec3} out The receiving Vec3
@param {Vec3} a The Vec3 point to rotate
@param {Vec3} b The origin of the rotation
@param {number} c The angle of rotation
@returns {Vec3} out 
*/
  export function rotateX(out: Vec3, a: Vec3, b: Vec3, c: number): Vec3

  /* 
Rotate a 3D vector around the y-axis
@param {Vec3} out The receiving Vec3
@param {Vec3} a The Vec3 point to rotate
@param {Vec3} b The origin of the rotation
@param {number} c The angle of rotation
@returns {Vec3} out 
*/
  export function rotateY(out: Vec3, a: Vec3, b: Vec3, c: number): Vec3

  /* 
Rotate a 3D vector around the z-axis
@param {Vec3} out The receiving Vec3
@param {Vec3} a The Vec3 point to rotate
@param {Vec3} b The origin of the rotation
@param {number} c The angle of rotation
@returns {Vec3} out 
*/
  export function rotateZ(out: Vec3, a: Vec3, b: Vec3, c: number): Vec3

  /* 
Math.round the components of a Vec3

@param {Vec3} out the receiving vector
@param {Vec3} a vector to round
@returns {Vec3} out 
*/
  export function round(out: Vec3, a: Vec3): Vec3

  /* 
Scales a Vec3 by a scalar number

@param {Vec3} out the receiving vector
@param {Vec3} a the vector to scale
@param {number} b amount to scale the vector by
@returns {Vec3} out 
*/
  export function scale(out: Vec3, a: Vec3, b: number): Vec3

  /* 
Adds two Vec3's after scaling the second operand by a scalar value

@param {Vec3} out the receiving vector
@param {Vec3} a the first operand
@param {Vec3} b the second operand
@param {number} scale the amount to scale b by before adding
@returns {Vec3} out 
*/
  export function scaleAndAdd(out: Vec3, a: Vec3, b: Vec3, scale: number): Vec3

  /* 
Set the components of a Vec3 to the given values

@param {Vec3} out the receiving vector
@param {number} x X component
@param {number} y Y component
@param {number} z Z component
@returns {Vec3} out 
*/
  export function set(out: Vec3, x: number, y: number, z: number): Vec3

  /* 
Calculates the squared euclidian distance between two Vec3's

@param {Vec3} a the first operand
@param {Vec3} b the second operand
@returns {number} squared distance between a and b 
*/
  export function sqrDist(a: Vec3, b: Vec3): number

  /* 
Calculates the squared length of a Vec3

@param {Vec3} a vector to calculate squared length of
@returns {number} squared length of a 
*/
  export function sqrLen(a: Vec3): number

  /* 
Calculates the squared euclidian distance between two Vec3's

@param {Vec3} a the first operand
@param {Vec3} b the second operand
@returns {number} squared distance between a and b 
*/
  export function squaredDistance(a: Vec3, b: Vec3): number

  /* 
Calculates the squared length of a Vec3

@param {Vec3} a vector to calculate squared length of
@returns {number} squared length of a 
*/
  export function squaredLength(a: Vec3): number

  /* 
Subtracts vector b from vector a

@param {Vec3} out the receiving vector
@param {Vec3} a the first operand
@param {Vec3} b the second operand
@returns {Vec3} out 
*/
  export function sub(out: Vec3, a: Vec3, b: Vec3): Vec3

  /* 
Subtracts vector b from vector a

@param {Vec3} out the receiving vector
@param {Vec3} a the first operand
@param {Vec3} b the second operand
@returns {Vec3} out 
*/
  export function subtract(out: Vec3, a: Vec3, b: Vec3): Vec3

  /* 
Transforms the Vec3 with a mat3.

@param {Vec3} out the receiving vector
@param {Vec3} a the vector to transform
@param {mat43 m the 3x3 matrix to transform with
@returns {Vec3} out 
*/
  export function transformMat3(out: Vec3, a: Vec3, m: Mat3): Vec3

  /* 
Transforms the Vec3 with a mat4.
4th vector component is implicitly '1'

@param {Vec3} out the receiving vector
@param {Vec3} a the vector to transform
@param {mat4} m matrix to transform with
@returns {Vec3} out 
*/
  export function transformMat4(out: Vec3, a: Vec3, m: Mat4): Vec3

  /* 
Transforms the Vec3 with a quat

@param {Vec3} out the receiving vector
@param {Vec3} a the vector to transform
@param {quat} q quaternion to transform with
@returns {Vec3} out 
*/
  export function transformQuat(out: Vec3, a: Vec3, q: Quat): Vec3
}
