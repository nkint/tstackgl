interface Vec2Array extends Array<number> {
  length: 2
}
type Vec2Tuple = [number, number]
export interface Vec2 extends Vec2Array, Vec2Tuple {}

interface Vec3Array extends Array<number> {
  length: 3
}
type Vec3Tuple = [number, number, number]
export interface Vec3 extends Vec3Array, Vec3Tuple {}

interface Vec4Array extends Array<number> {
  length: 4
}
type Vec4Tuple = [number, number, number, number]
export interface Vec4 extends Vec4Array, Vec4Tuple {}

interface QuatArray extends Array<number> {
  length: 4
}
type QuatTuple = [number, number, number, number]
export interface Quat extends QuatArray, QuatTuple {}

interface Mat3Array extends Array<number> {
  length: 9
}
type Mat3Tuple = [number, number, number, number, number, number, number, number, number]
export interface Mat3 extends Mat3Array, Mat3Tuple {}

interface Mat2Array extends Array<number> {
  length: 4
}
type Mat2Tuple = [number, number, number, number]
export interface Mat2 extends Mat2Array, Mat2Tuple {}

interface Mat4Array extends Array<number> {
  length: 16
}
type Mat4Tuple = [
  number,
  number,
  number,
  number,
  number,
  number,
  number,
  number,
  number,
  number,
  number,
  number,
  number,
  number,
  number,
  number
]
export interface Mat4 extends Mat4Array, Mat4Tuple {}

export type Mesh = {
  positions: Array<Vec3>
  cells: Array<Vec3>
  normals?: Array<Vec3>
  uvs?: Array<Vec2>
  colors?: Array<Vec3>
}

export type QuadMesh = Mesh & {
  quadCells: Array<Vec4>
}
