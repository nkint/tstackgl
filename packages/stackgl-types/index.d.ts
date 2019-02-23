// https://github.com/mikolalysenko/angle-normals

declare module 'angle-normals' {
  import { Vec3 } from '@tstackgl/types'
  function m(cells: Vec3[], positions: Vec3[]): Vec3[]
  export = m
}
// https://github.com/mikolalysenko/bound-points

declare module 'bound-points' {
  function findBounds<T>(input: ArrayLike<T>): [T, T]
  export = findBounds
}
// https://github.com/mikolalysenko/bunny

declare module 'bunny' {
  import { Vec3 } from '@tstackgl/types'

  const b: {
    positions: Array<Vec3>
    cells: Array<Vec3>
  }
  export = b
}
// NOTE: parcel will handle this for you

declare module '*.png' {}

declare module '*.svg' {}

declare module '*.css' {}

declare module '*.vert' {
  const content: string
  export default content
}

declare module '*.frag' {
  const content: string
  export default content
}
// https://github.com/mikolalysenko/convex-hull
declare module 'convex-hull' {
  function hull<T>(points: Array<T>): Array<T>
  export = hull
}
// https://github.com/hughsk/cube-cube

declare module 'cube-cube' {
  import { Vec3, Mesh } from '@tstackgl/types'

  function c(
    w: Number,
    h: Number,
    d: Number,
    filter?: (x: Number, y: Number, z: Number) => Boolean,
  ): Array<Mesh & { centroid: Vec3; index: Vec3 }>
  export = c
}
// https://github.com/hughsk/face-normals

declare module 'face-normals' {
  import { Vec3 } from '@tstackgl/types'
  function faceNormals(verts: ArrayLike<Number>, out?: Float32Array): Float32Array
  export = faceNormals
}
// https://github.com/gregtatum/geo-3d-box
declare module 'geo-3d-box' {
  import { Mesh, Vec3 } from '@tstackgl/types'

  function createBox(opts?: { size?: number | Vec3; segments?: number | Vec3 }): Mesh

  export = createBox
}
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
// https://github.com/hughsk/mesh-reindex

declare module 'mesh-reindex' {
  import { Vec3, Mesh } from '@tstackgl/types'

  function reindex(input: Float32Array): Mesh
  export = reindex
}
// Type definitions for noisejs
// Project: https://github.com/xixixao/noisejs
// Definitions by: Atsushi Izumihara <https://github.com/izmhr>
// Definitions: https://github.com/DefinitelyTyped/DefinitelyTyped

declare module 'noisejs' {
  export class Noise {
    /**
     * Passing in seed will seed this Noise instance
     * @param  {number} seed
     * @return {Noise}       Noise instance
     */
    constructor(seed?: number)

    /**
     * 2D simplex noise
     * @param  {number} x
     * @param  {number} y
     * @return {number} noise value
     */
    simplex2(x: number, y: number): number

    /**
     * 3D simplex noise
     * @param  {number} x
     * @param  {number} y
     * @param  {number} z
     * @return {number} noise value
     */
    simplex3(x: number, y: number, z: number): number

    /**
     * 2D Perlin Noise
     * @param  {number} x
     * @param  {number} y
     * @return {number} noise value
     */
    perlin2(x: number, y: number): number

    /**
     * 3D Perlin Noise
     * @param  {number} x
     * @param  {number} y
     * @param  {number} z
     * @return {number} noise value
     */
    perlin3(x: number, y: number, z: number): number

    /**
     * This isn't a very good seeding function, but it works ok. It supports 2^16
     * different seed values. Write something better if you need more seeds.
     * @param {number} seed [description]
     */
    seed(seed: number): void
  }
}
// https://github.com/mikolalysenko/normals

declare module 'normals' {
  import { Vec3 } from '@tstackgl/types'

  export function vertexNormals(cells: Vec3[], positions: Vec3[], epsilon?: number): Vec3[]
  export function faceNormals(cells: Vec3[], positions: Vec3[], epsilon?: number): Vec3[]
}
// https://github.com/mikolalysenko/orbit-camera

declare module 'orbit-camera' {
  import { Vec3, Vec2, Mat4, Quat } from '@tstackgl/types'

  type CameraInstance = {
    lookAt: (eye: Vec3, center: Vec3, up: Vec3) => void
    pan: (translation: Vec3) => void
    rotate: (cur: Vec2, prev: Vec2) => void
    zoom: (delta: number) => void
    view: (out?: Mat4) => Mat4

    rotation: Quat
    distance: Number
  }
  function c(eye: Vec3, center: Vec3, up: Vec3): CameraInstance

  export = c
}
// https://github.com/substack/point-in-polygon

declare module 'point-in-polygon' {
  import { Vec2 } from '@tstackgl/types'

  function pointInPolygon(point: Vec2, positions: ArrayLike<Vec2>): boolean

  export = pointInPolygon
}
// https://github.com/mauriciopoppe/point-line-distance

declare module 'point-line-distance' {
  import { Vec2 } from '@tstackgl/types'

  function distance(point: Vec2, a: Vec2, b: Vec2): boolean

  export = distance
}
// https://github.com/vorg/primitive-capsule
declare module 'primitive-capsule' {
  import { Mesh } from '@tstackgl/types'

  function createCapsule(r?: number, h?: number, n?: number): Mesh

  export = createCapsule
}
// https://github.com/glo-js/primitive-icosphere
declare module 'primitive-icosphere' {
  import { Mesh } from '@tstackgl/types'

  function createIcosphere(
    radius?: number,
    opts?: {
      subdivisions: number
    },
  ): Mesh

  export = createIcosphere
}
// https://github.com/vorg/primitive-plane
declare module 'primitive-plane' {
  import { Mesh } from '@tstackgl/types'

  function createPlane(
    sx?: Number,
    sy?: Number,
    nx?: Number,
    ny?: Number,
    options?: { quads: boolean },
  ): Mesh

  export = createPlane
}
// https://github.com/glo-js/primitive-quad
declare module 'primitive-quad' {
  import { Mesh } from '@tstackgl/types'

  function createQuad(scale?: number): Mesh

  export = createQuad
}
// https://github.com/glo-js/primitive-sphere

declare module 'primitive-sphere' {
  import { Mesh } from '@tstackgl/types'

  function createIcosphere(
    radius?: number,
    opts?: {
      segments: number
    },
  ): Mesh

  export = createIcosphere
}
// https://github.com/glo-js/primitive-torus
declare module 'primitive-torus' {
  import { Mesh } from '@tstackgl/types'

  function createTorus(opt?: {
    majorRadius?: number
    minorRadius?: number
    majorSegments?: number
    minorSegments?: number
    arc?: number
  }): Mesh

  export = createTorus
}
// https://github.com/regl-project/regl-camera

declare module 'regl-camera' {
  function createCamera(
    regl: any,
    opts: {
      distance: number
      phi: number
      theta: number
    },
  ): (input: any) => void

  export = createCamera
}
// https://github.com/thibauts/serialize-wavefront-obj

declare module 'serialize-wavefront-obj' {
  import { Vec3 } from '@tstackgl/types'

  function serialize(
    cells: Vec3[],
    positions: Vec3[],
    vertexNormals: Vec3[],
    vertexUVs?: Vec3[],
    faceNormals?: Vec3[],
    faceUVs?: Vec3[],
    name?: string,
  ): string

  export = serialize
}
// https://github.com/aheckmann/sliced

declare module 'sliced' {
  function sliced<T>(arr: Array<T>, slice?: number, sliceEnd?: number): Array<T>
  export = sliced
}
// https://github.com/hughsk/stanford-dragon

declare module 'stanford-dragon' {
  import { Vec3 } from '@tstackgl/types'

  const b: {
    positions: Array<Vec3>
    cells: Array<Vec3>
  }

  export = b
}

declare module 'stanford-dragon/1' {
  import { Vec3 } from '@tstackgl/types'

  const b: {
    positions: Array<Vec3>
    cells: Array<Vec3>
  }

  export = b
}

declare module 'stanford-dragon/2' {
  import { Vec3 } from '@tstackgl/types'

  const b: {
    positions: Array<Vec3>
    cells: Array<Vec3>
  }

  export = b
}

declare module 'stanford-dragon/3' {
  import { Vec3 } from '@tstackgl/types'

  const b: {
    positions: Array<Vec3>
    cells: Array<Vec3>
  }

  export = b
}

declare module 'stanford-dragon/4' {
  import { Vec3 } from '@tstackgl/types'

  const b: {
    positions: Array<Vec3>
    cells: Array<Vec3>
  }

  export = b
}
// https://github.com/mikolalysenko/teapot
declare module 'teapot' {
  import { Mesh } from '@tstackgl/types'

  const teapot: Mesh

  export = teapot
}
// https://github.com/hughsk/unindex-mesh

declare module 'unindex-mesh' {
  import { Vec3, Mesh } from '@tstackgl/types'

  function c(positions: Array<Vec3>, faces: Array<Vec3>, out?: Float32Array): Float32Array
  function c(mes: Mesh, out?: Float32Array): Float32Array
  export = c
}
