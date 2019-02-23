declare module 'gl-mat4' {
  import { Mat4, Quat, Vec3 } from '@tstackgl/types'
  /* 
Calculates the adjugate of a Mat4

@param {Mat4} out the receiving matrix
@param {Mat4} a the source matrix
@returns {Mat4} out 
*/
  export function adjoint(out: Mat4, a: Mat4): Mat4

  /* 
Creates a new Mat4 initialized with values from an existing matrix

@param {Mat4} a matrix to clone
@returns {Mat4} a new 4x4 matrix 
*/
  export function clone(a: Mat4): Mat4

  /* 
Copy the values from one Mat4 to another

@param {Mat4} out the receiving matrix
@param {Mat4} a the source matrix
@returns {Mat4} out 
*/
  export function copy(out: Mat4, a: Mat4): Mat4

  /* 
Creates a new identity Mat4

@returns {Mat4} a new 4x4 matrix 
*/
  export function create(): Mat4

  /* 
Calculates the determinant of a Mat4

@param {Mat4} a the source matrix
@returns {Number} determinant of a 
*/
  export function determinant(a: Mat4): Number

  /* 
Creates a matrix from a quaternion rotation.

@param {Mat4} out Mat4 receiving operation result
@param {Quat} q Rotation quaternion
@returns {Mat4} out 
*/
  export function fromQuat(out: Mat4, q: Quat): Mat4

  /* 
Creates a matrix from a given angle around a given axis
This is equivalent to (but much faster than):

    Mat4.identity(dest)
    Mat4.rotate(dest, dest, rad, axis)

@param {Mat4} out Mat4 receiving operation result
@param {Number} rad the angle to rotate the matrix by
@param {Vec3} axis the axis to rotate around
@returns {Mat4} out 
*/
  export function fromRotation(out: Mat4, rad: Number, axis: Vec3): Mat4

  /* 
Creates a matrix from a quaternion rotation and vector translation
This is equivalent to (but much faster than):

    Mat4.identity(dest);
    Mat4.translate(dest, vec);
    var quatMat = Mat4.create();
    Quat.toMat4(quat, quatMat);
    Mat4.multiply(dest, quatMat);

@param {Mat4} out Mat4 receiving operation result
@param {Quat} q Rotation quaternion
@param {Vec3} v Translation vector
@returns {Mat4} out 
*/
  export function fromRotationTranslation(out: Mat4, q: Quat, v: Vec3): Mat4

  /* 
Creates a matrix from a vector scaling
This is equivalent to (but much faster than):

    Mat4.identity(dest)
    Mat4.scale(dest, dest, vec)

@param {Mat4} out Mat4 receiving operation result
@param {Vec3} v Scaling vector
@returns {Mat4} out 
*/
  export function fromScaling(out: Mat4, v: Vec3): Mat4

  /* 
Creates a matrix from a vector translation
This is equivalent to (but much faster than):

    Mat4.identity(dest)
    Mat4.translate(dest, dest, vec)

@param {Mat4} out Mat4 receiving operation result
@param {Vec3} v Translation vector
@returns {Mat4} out 
*/
  export function fromTranslation(out: Mat4, v: Vec3): Mat4

  /* 
Creates a matrix from the given angle around the X axis
This is equivalent to (but much faster than):

    Mat4.identity(dest)
    Mat4.rotateX(dest, dest, rad)

@param {Mat4} out Mat4 receiving operation result
@param {Number} rad the angle to rotate the matrix by
@returns {Mat4} out 
*/
  export function fromXRotation(out: Mat4, rad: Number): Mat4

  /* 
Creates a matrix from the given angle around the Y axis
This is equivalent to (but much faster than):

    Mat4.identity(dest)
    Mat4.rotateY(dest, dest, rad)

@param {Mat4} out Mat4 receiving operation result
@param {Number} rad the angle to rotate the matrix by
@returns {Mat4} out 
*/
  export function fromYRotation(out: Mat4, rad: Number): Mat4

  /* 
Creates a matrix from the given angle around the Z axis
This is equivalent to (but much faster than):

    Mat4.identity(dest)
    Mat4.rotateZ(dest, dest, rad)

@param {Mat4} out Mat4 receiving operation result
@param {Number} rad the angle to rotate the matrix by
@returns {Mat4} out 
*/
  export function fromZRotation(out: Mat4, rad: Number): Mat4

  /* 
Generates a frustum matrix with the given bounds

@param {Mat4} out Mat4 frustum matrix will be written into
@param {Number} left Left bound of the frustum
@param {Number} right Right bound of the frustum
@param {Number} bottom Bottom bound of the frustum
@param {Number} top Top bound of the frustum
@param {Number} near Near bound of the frustum
@param {Number} far Far bound of the frustum
@returns {Mat4} out 
*/
  export function frustum(
    out: Mat4,
    left: Number,
    right: Number,
    bottom: Number,
    top: Number,
    near: Number,
    far: Number,
  ): Mat4

  /* 
Set a Mat4 to the identity matrix

@param {Mat4} out the receiving matrix
@returns {Mat4} out 
*/
  export function identity(out: Mat4): Mat4

  /* 
Inverts a Mat4

@param {Mat4} out the receiving matrix
@param {Mat4} a the source matrix
@returns {Mat4} out 
*/
  export function invert(out: Mat4, a: Mat4): Mat4

  /* 
Generates a look-at matrix with the given eye position, focal point, and up axis

@param {Mat4} out Mat4 frustum matrix will be written into
@param {Vec3} eye Position of the viewer
@param {Vec3} center Point the viewer is looking at
@param {Vec3} up Vec3 pointing up
@returns {Mat4} out 
*/
  export function lookAt(out: Mat4, eye: Vec3, center: Vec3, up: Vec3): Mat4

  /* 
Multiplies two Mat4's

@param {Mat4} out the receiving matrix
@param {Mat4} a the first operand
@param {Mat4} b the second operand
@returns {Mat4} out 
*/
  export function multiply(out: Mat4, a: Mat4, b: Mat4): Mat4

  /* 
Generates a orthogonal projection matrix with the given bounds

@param {Mat4} out Mat4 frustum matrix will be written into
@param {number} left Left bound of the frustum
@param {number} right Right bound of the frustum
@param {number} bottom Bottom bound of the frustum
@param {number} top Top bound of the frustum
@param {number} near Near bound of the frustum
@param {number} far Far bound of the frustum
@returns {Mat4} out 
*/
  export function ortho(
    out: Mat4,
    left: number,
    right: number,
    bottom: number,
    top: number,
    near: number,
    far: number,
  ): Mat4

  /* 
Generates a perspective projection matrix with the given bounds

@param {Mat4} out Mat4 frustum matrix will be written into
@param {number} fovy Vertical field of view in radians
@param {number} aspect Aspect ratio. typically viewport width/height
@param {number} near Near bound of the frustum
@param {number} far Far bound of the frustum
@returns {Mat4} out 
*/
  export function perspective(
    out: Mat4,
    fovy: number,
    aspect: number,
    near: number,
    far: number,
  ): Mat4

  /* 
Generates a perspective projection matrix with the given field of view.
This is primarily useful for generating projection matrices to be used
with the still experiemental WebVR API.

@param {Mat4} out Mat4 frustum matrix will be written into
@param {number} fov Object containing the following values: upDegrees, downDegrees, leftDegrees, rightDegrees
@param {number} near Near bound of the frustum
@param {number} far Far bound of the frustum
@returns {Mat4} out 
*/
  export function perspectiveFromFieldOfView(
    out: Mat4,
    fov: number,
    near: number,
    far: number,
  ): Mat4

  /* 
Rotates a Mat4 by the given angle

@param {Mat4} out the receiving matrix
@param {Mat4} a the matrix to rotate
@param {Number} rad the angle to rotate the matrix by
@param {Vec3} axis the axis to rotate around
@returns {Mat4} out 
*/
  export function rotate(out: Mat4, a: Mat4, rad: Number, axis: Vec3): Mat4

  /* 
Rotates a matrix by the given angle around the X axis

@param {Mat4} out the receiving matrix
@param {Mat4} a the matrix to rotate
@param {Number} rad the angle to rotate the matrix by
@returns {Mat4} out 
*/
  export function rotateX(out: Mat4, a: Mat4, rad: Number): Mat4

  /* 
Rotates a matrix by the given angle around the Y axis

@param {Mat4} out the receiving matrix
@param {Mat4} a the matrix to rotate
@param {Number} rad the angle to rotate the matrix by
@returns {Mat4} out 
*/
  export function rotateY(out: Mat4, a: Mat4, rad: Number): Mat4

  /* 
Rotates a matrix by the given angle around the Z axis

@param {Mat4} out the receiving matrix
@param {Mat4} a the matrix to rotate
@param {Number} rad the angle to rotate the matrix by
@returns {Mat4} out 
*/
  export function rotateZ(out: Mat4, a: Mat4, rad: Number): Mat4

  /* 
Scales the Mat4 by the dimensions in the given Vec3

@param {Mat4} out the receiving matrix
@param {Mat4} a the matrix to scale
@param {Vec3} v the Vec3 to scale the matrix by
@returns {Mat4} out 
*/
  export function scale(out: Mat4, a: Mat4, v: Vec3): Mat4

  /* 
Returns a string representation of a Mat4

@param {Mat4} mat matrix to represent as a string
@returns {String} string representation of the matrix 
*/
  export function str(mat: Mat4): String

  /* 
Translate a Mat4 by the given vector

@param {Mat4} out the receiving matrix
@param {Mat4} a the matrix to translate
@param {Vec3} v vector to translate by
@returns {Mat4} out 
*/
  export function translate(out: Mat4, a: Mat4, v: Vec3): Mat4

  /* 
Transpose the values of a Mat4

@param {Mat4} out the receiving matrix
@param {Mat4} a the source matrix
@returns {Mat4} out 
*/
  export function transpose(out: Mat4, a: Mat4): Mat4
}
