declare module 'gl-mat3' {
  import { Mat3, Mat2, Quat, Mat4, Vec2 } from '@tstackgl/types'

  /* 
  Calculates the adjugate of a Mat3

  @alias Mat3.adjoint
  @param {Mat3} out the receiving matrix
  @param {Mat3} a the source matrix
  @returns {Mat3} out 
  */
  export function adjoint(out: Mat3, a: Mat3): Mat3

  /* 
  Creates a new Mat3 initialized with values from an existing matrix

  @alias Mat3.clone
  @param {Mat3} a matrix to clone
  @returns {Mat3} a new 3x3 matrix 
  */
  export function clone(a: Mat3): Mat3

  /* 
Copy the values from one Mat3 to another

@alias Mat3.copy
@param {Mat3} out the receiving matrix
@param {Mat3} a the source matrix
@returns {Mat3} out 
*/
  export function copy(out: Mat3, a: Mat3): Mat3

  /* 
Creates a new identity Mat3

@alias Mat3.create
@returns {Mat3} a new 3x3 matrix 
*/
  export function create(): Mat3

  /* 
Calculates the determinant of a Mat3

@alias Mat3.determinant
@param {Mat3} a the source matrix
@returns {Number} determinant of a 
*/
  export function determinant(a: Mat3): Number

  /* 
Returns Frobenius norm of a Mat3

@alias Mat3.frob
@param {Mat3} a the matrix to calculate Frobenius norm of
@returns {Number} Frobenius norm 
*/
  export function frob(a: Mat3): Number

  /* 
Copies the values from a Mat2 into a Mat3

@alias Mat3.fromMat2
@param {Mat3} out the receiving matrix
@param {Mat2} a the matrix to copy
@returns {Mat3} out 
*/
  export function fromMat2(out: Mat3, a: Mat2): Mat3

  /* 
Copies the upper-left 3x3 values into the given Mat3.

@alias Mat3.fromMat4
@param {Mat3} out the receiving 3x3 matrix
@param {mat4} a   the source 4x4 matrix
@returns {Mat3} out 
*/
  export function fromMat4(out: Mat3, a: Mat4): Mat3

  /* 
Calculates a 3x3 matrix from the given quaternion

@alias Mat3.fromQuat
@param {Mat3} out Mat3 receiving operation result
@param {quat} q Quaternion to create matrix from

@returns {Mat3} out 
*/
  export function fromQuat(out: Mat3, q: Quat): Mat3

  /* 
Set a Mat3 to the identity matrix

@alias Mat3.identity
@param {Mat3} out the receiving matrix
@returns {Mat3} out 
*/
  export function identity(out: Mat3): Mat3

  /* 
Inverts a Mat3

@alias Mat3.invert
@param {Mat3} out the receiving matrix
@param {Mat3} a the source matrix
@returns {Mat3} out 
*/
  export function invert(out: Mat3, a: Mat3): Mat3

  /* 
Multiplies two Mat3's

@alias Mat3.multiply
@param {Mat3} out the receiving matrix
@param {Mat3} a the first operand
@param {Mat3} b the second operand
@returns {Mat3} out 
*/
  export function multiply(out: Mat3, a: Mat3, b: Mat3): Mat3

  /* 
Calculates a 3x3 normal matrix (transpose inverse) from the 4x4 matrix

@alias Mat3.normalFromMat4
@param {Mat3} out Mat3 receiving operation result
@param {mat4} a Mat4 to derive the normal matrix from

@returns {Mat3} out 
*/
  export function normalFromMat4(out: Mat3, a: Mat4): Mat3

  /* 
Rotates a Mat3 by the given angle

@alias Mat3.rotate
@param {Mat3} out the receiving matrix
@param {Mat3} a the matrix to rotate
@param {Number} rad the angle to rotate the matrix by
@returns {Mat3} out 
*/
  export function rotate(out: Mat3, a: Mat3, rad: Number): Mat3

  /* 
Scales the Mat3 by the dimensions in the given vec2

@alias Mat3.scale
@param {Mat3} out the receiving matrix
@param {Mat3} a the matrix to rotate
@param {vec2} v the vec2 to scale the matrix by
@returns {Mat3} out 
*/
  export function scale(out: Mat3, a: Mat3, v: Vec2): Mat3

  /* 
Returns a string representation of a Mat3

@alias Mat3.str
@param {Mat3} mat matrix to represent as a string
@returns {String} string representation of the matrix 
*/
  export function str(mat: Mat3): String

  /* 
Translate a Mat3 by the given vector

@alias Mat3.translate
@param {Mat3} out the receiving matrix
@param {Mat3} a the matrix to translate
@param {vec2} v vector to translate by
@returns {Mat3} out 
*/
  export function translate(out: Mat3, a: Mat3, v: Vec2): Mat3

  /* 
Transpose the values of a Mat3

@alias Mat3.transpose
@param {Mat3} out the receiving matrix
@param {Mat3} a the source matrix
@returns {Mat3} out 
*/
  export function transpose(out: Mat3, a: Mat3): Mat3
}
