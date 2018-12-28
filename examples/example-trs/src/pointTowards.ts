import mat4 from 'gl-mat4'
import vec3 from 'gl-vec3'
import quat from 'gl-quat'
import { Mesh, Vec3, Quat, Mat4 } from '@tstackgl/types'

export function getAlignmentQuat(dir: Vec3, forward: Vec3): Quat {
  const target: Vec3 = vec3.normalize(vec3.create(), dir)
  const axis = vec3.cross(vec3.create(), forward, target)
  const length = vec3.length(axis) + 0.0001
  const angle = Math.atan2(length, vec3.dot(forward, target))
  return createFromAxisAngle(axis, angle)
}

export function createFromAxisAngle(axis: Vec3, angle: number): Quat {
  angle *= 0.5
  const sin = Math.sin(angle)
  const cos = Math.cos(angle)
  const q = quat.create()
  const axisNorm = normalizeTo(vec3.create(), axis, sin)
  q[0] = axisNorm[0]
  q[1] = axisNorm[1]
  q[2] = axisNorm[2]
  q[3] = cos

  return q
}

/**
 * Normalizes the vector to the given length.
 *
 * @param len desired length
 * @return itself
 */

export function normalizeTo(out: Vec3, a: Vec3, len: number) {
  let mag = Math.sqrt(a[0] * a[0] + a[1] * a[1] + a[2] * a[2])
  if (mag > 0) {
    mag = len / mag
    out[0] = a[0] * mag
    out[1] = a[1] * mag
    out[2] = a[2] * mag
  }
  return out
}

export function pointTowardsMat(dir: Vec3): Mat4 {
  const q: Quat = getAlignmentQuat(dir, [0, 0, 1])
  return mat4.fromQuat(mat4.create(), q)
}

/*

TOXICLIBS point toward

WETMesh pointTowards(ReadonlyVec3D dir) {
  mesh.transform(
    Quaternion.getAlignmentQuat(dir, Vec3D.Z_AXIS).toMatrix4x4(matrix),
    true
  );
}

public static Quaternion getAlignmentQuat(
  ReadonlyVec3D dir,
  ReadonlyVec3D forward)
{
  Vec3D target = dir.getNormalized();
  ReadonlyVec3D axis = forward.cross(target);
  float length = axis.magnitude() + 0.0001f;
  float angle = (float) Math.atan2(length, forward.dot(target));
  return createFromAxisAngle(axis, angle);
}

public static Quaternion createFromAxisAngle(ReadonlyVec3D axis, float angle) {
  angle *= 0.5;
  float sin = MathUtils.sin(angle);
  float cos = MathUtils.cos(angle);
  Quaternion q = new Quaternion(cos, axis.getNormalizedTo(sin));
  return q;
}

public Matrix4x4 toMatrix4x4(Matrix4x4 result) {
    // Converts this quaternion to a rotation matrix.
    //
    // | 1 - 2(y^2 + z^2) 2(xy + wz) 2(xz - wy) 0 |
    // | 2(xy - wz) 1 - 2(x^2 + z^2) 2(yz + wx) 0 |
    // | 2(xz + wy) 2(yz - wx) 1 - 2(x^2 + y^2) 0 |
    // | 0 0 0 1 |

    float x2 = x + x;
    float y2 = y + y;
    float z2 = z + z;
    float xx = x * x2;
    float xy = x * y2;
    float xz = x * z2;
    float yy = y * y2;
    float yz = y * z2;
    float zz = z * z2;
    float wx = w * x2;
    float wy = w * y2;
    float wz = w * z2;

    return result.set(1 - (yy + zz), xy - wz, xz + wy, 0, xy + wz,
            1 - (xx + zz), yz - wx, 0, xz - wy, yz + wx, 1 - (xx + yy), 0,
            0, 0, 0, 1);
}

*/
