declare module 'gl-quat' {
  import { Quat, Mat3, Vec3 } from '@tstackgl/types'

  /* 
Calculates the W component of a Quat from the X, Y, and Z components.
Assumes that Quaternion is 1 unit in length.
Any existing W component will be ignored.

@param {Quat} out the receiving Quaternion
@param {Quat} a Quat to calculate W component of
@returns {Quat} out 
*/
  export function calculateW(out: Quat, a: Quat): Quat

  /* 
Calculates the conjugate of a Quat
If the Quaternion is normalized, this function is faster than Quat.inverse and produces the same result.

@param {Quat} out the receiving Quaternion
@param {Quat} a Quat to calculate conjugate of
@returns {Quat} out 
*/
  export function conjugate(out: Quat, a: Quat): Quat

  /* 
Creates a new identity Quat

@returns {Quat} a new Quaternion 
*/
  export function create(): Quat

  /* 
Creates a Quaternion from the given 3x3 rotation matrix.

NOTE: The resultant Quaternion is not normalized, so you should be sure
to renormalize the Quaternion yourself where necessary.

@param {Quat} out the receiving Quaternion
@param {mat3} m rotation matrix
@returns {Quat} out
@function 
*/
  export function fromMat3(out: Quat, m: Mat3): Quat

  /* 
Set a Quat to the identity Quaternion

@param {Quat} out the receiving Quaternion
@returns {Quat} out 
*/
  export function identity(out: Quat): Quat

  /* 
Calculates the inverse of a Quat

@param {Quat} out the receiving Quaternion
@param {Quat} a Quat to calculate inverse of
@returns {Quat} out 
*/
  export function invert(out: Quat, a: Quat): Quat

  /* 
Multiplies two Quat's

@param {Quat} out the receiving Quaternion
@param {Quat} a the first operand
@param {Quat} b the second operand
@returns {Quat} out 
*/
  export function multiply(out: Quat, a: Quat, b: Quat): Quat

  /* 
Rotates a Quaternion by the given angle about the X axis

@param {Quat} out Quat receiving operation result
@param {Quat} a Quat to rotate
@param {number} rad angle (in radians) to rotate
@returns {Quat} out 
*/
  export function rotateX(out: Quat, a: Quat, rad: number): Quat

  /* 
Rotates a Quaternion by the given angle about the Y axis

@param {Quat} out Quat receiving operation result
@param {Quat} a Quat to rotate
@param {number} rad angle (in radians) to rotate
@returns {Quat} out 
*/
  export function rotateY(out: Quat, a: Quat, rad: number): Quat

  /* 
Rotates a Quaternion by the given angle about the Z axis

@param {Quat} out Quat receiving operation result
@param {Quat} a Quat to rotate
@param {number} rad angle (in radians) to rotate
@returns {Quat} out 
*/
  export function rotateZ(out: Quat, a: Quat, rad: number): Quat

  /* 
Sets a Quaternion to represent the shortest rotation from one
vector to another.

Both vectors are assumed to be unit length.

@param {Quat} out the receiving Quaternion.
@param {Vec3} a the initial vector
@param {Vec3} b the destination vector
@returns {Quat} out 
*/
  export function rotationTo(out: Quat, a: Vec3, b: Vec3): Quat

  /* 
Sets the specified Quaternion with values corresponding to the given
axes. Each axis is a Vec3 and is expected to be unit length and
perpendicular to all other specified axes.

@param {Vec3} view  the vector representing the viewing direction
@param {Vec3} right the vector representing the local "right" direction
@param {Vec3} up    the vector representing the local "up" direction
@returns {Quat} out 
*/
  export function setAxes(view: Vec3, right: Vec3, up: Vec3): Quat

  /* 
Sets a Quat from the given angle and rotation axis,
then returns it.

@param {Quat} out the receiving Quaternion
@param {Vec3} axis the axis around which to rotate
@param {Number} rad the angle in radians
@returns {Quat} out 
*/
  export function setAxisAngle(out: Quat, axis: Vec3, rad: Number): Quat

  /* 
Performs a spherical linear interpolation between two Quat

@param {Quat} out the receiving Quaternion
@param {Quat} a the first operand
@param {Quat} b the second operand
@param {Number} t interpolation amount between the two inputs
@returns {Quat} out 
*/
  export function slerp(out: Quat, a: Quat, b: Quat, t: Number): Quat

  /* 
Performs a spherical linear interpolation with two control points

@param {Quat} out the receiving Quaternion
@param {Quat} a the first operand
@param {Quat} b the second operand
@param {Quat} c the third operand
@param {Quat} d the fourth operand
@param {Number} t interpolation amount
@returns {Quat} out 
*/
  export function sqlerp(out: Quat, a: Quat, b: Quat, c: Quat, d: Quat, t: Number): Quat
}
