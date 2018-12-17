import vec3 from 'gl-vec3'
import quat from 'gl-quat'
import mat3 from 'gl-mat3'
import mat4 from 'gl-mat4'
import { Mat3, Mat4, Vec3 } from '@tstackgl/types'

function transform(out: Vec3, v: Vec3, matrix: Mat4): Vec3 {
  const temp: Mat3 = mat3.create()
  const width: number = 4
  // const matrixGet = (x: number, y: number) => matrix[y + x * width]
  for (let i = 0; i < width; i++) {
    temp[i] =
      v[0] * matrix[0 + i * width] + //matrixGet(i, 0) +
      v[1] * matrix[1 + i * width] + //matrixGet(i, 1) +
      v[2] * matrix[2 + i * width] + //matrixGet(i, 2) +
      matrix[3 + i * width] //matrixGet(i, 3)
  }
  out[0] = (temp[0] * 1.0) / temp[3]
  out[1] = (temp[1] * 1.0) / temp[3]
  out[2] = (temp[2] * 1.0) / temp[3]

  return out
}

export function pointTowards(positions: Array<Vec3>, forward: Vec3, direction: Vec3): Array<Vec3> {
  forward = vec3.normalize(vec3.create(), forward)
  direction = vec3.normalize(vec3.create(), direction)
  const q = quat.rotationTo(quat.create(), forward, direction)
  const matFromQuat = mat4.fromQuat(mat4.create(), q)
  const ret = positions.map(point => {
    const out = transform(vec3.create(), point, matFromQuat)
    return out
  })
  return ret
}
