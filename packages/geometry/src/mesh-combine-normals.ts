import slice = require('sliced')
import { Mesh } from '@tstackgl/types'
import { Vec3 } from '@tstackgl/types'

export function combine(meshes: Array<Mesh>): Mesh {
  const hasNormals = meshes.every(
    mesh => mesh.normals && mesh.positions.length === mesh.normals.length,
  )
  const hasColors = meshes.every(
    mesh => mesh.colors && mesh.positions.length === mesh.colors.length,
  )

  const pos = []
  const cel = []
  const nor = []
  const color = []
  let p = 0
  let c = 0
  let k = 0
  let j = 0

  for (let i = 0; i < meshes.length; i++) {
    const mpos = meshes[i].positions
    const mcel = meshes[i].cells
    const mnor = meshes[i].normals
    const mcol = meshes[i].colors

    for (j = 0; j < mpos.length; j++) {
      pos[j + p] = slice(mpos[j])
      if (hasNormals) nor[j + p] = slice(mnor[j])
      if (hasColors) color[j + p] = slice(mcol[j])
    }

    for (j = 0; j < mcel.length; j++) {
      cel[(k = j + c)] = slice(mcel[j])

      for (let l = 0; l < cel[k].length; l++) {
        cel[k][l] += p
      }
    }

    p += mpos.length
    c += mcel.length
  }

  return {
    cells: cel as Array<Vec3>,
    positions: pos as Array<Vec3>,
    ...(hasNormals && { normals: nor as Array<Vec3> }),
    ...(hasColors && { colors: color as Array<Vec3> }),
  }
}
