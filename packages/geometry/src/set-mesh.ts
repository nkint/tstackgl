import { Mesh } from '@tstackgl/types'

export function setMesh(out: Mesh, input: Mesh) {
  out.positions = input.positions
  out.cells = input.cells

  if (input.normals) {
    out.normals = input.normals
  }
  if (input.uvs) {
    out.uvs = input.uvs
  }
  if (input.colors) {
    out.colors = input.colors
  }
}
