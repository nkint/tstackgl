import { QuadMesh } from '@tstackgl/types'

export function createCylinderMesh(
  radiusTop: number,
  radiusBottom: number,
  height: number,
  radialSegments: number,
  heightSegments: number,
): QuadMesh {
  let index = 0
  let indexOffset = 0
  const indexArray = []

  const vertexCount = (radialSegments + 1) * (heightSegments + 1)
  const cellCount = radialSegments * heightSegments * 2

  const normals = new Array(vertexCount)
  const vertices = new Array(vertexCount)
  const uvs = new Array(vertexCount)
  const cells = new Array(cellCount)
  const quadCells = new Array(cellCount / 2)

  const slope = (radiusBottom - radiusTop) / height
  const thetaLength = 2.0 * Math.PI

  for (let y = 0; y <= heightSegments; y++) {
    const indexRow = []
    const v = y / heightSegments
    const radius = v * (radiusBottom - radiusTop) + radiusTop

    for (let x = 0; x <= radialSegments; x++) {
      const u = x / radialSegments
      const theta = u * thetaLength
      const sinTheta = Math.sin(theta)
      const cosTheta = Math.cos(theta)
      vertices[index] = [radius * sinTheta, -v * height + height / 2, radius * cosTheta]
      normals[index] = [sinTheta, slope, cosTheta]
      uvs[index] = [u, 1 - v]

      indexRow.push(index)
      index++
    }

    indexArray.push(indexRow)
  }

  for (let x = 0; x < radialSegments; x++) {
    for (let y = 0; y < heightSegments; y++) {
      const i1 = indexArray[y][x]
      const i2 = indexArray[y + 1][x]
      const i3 = indexArray[y + 1][x + 1]
      const i4 = indexArray[y][x + 1]

      quadCells[indexOffset / 2] = [i1, i2, i3, i4]

      // face one
      cells[indexOffset] = [i1, i2, i4]
      indexOffset++

      // face two
      cells[indexOffset] = [i2, i3, i4]
      indexOffset++
    }
  }

  return {
    positions: vertices,
    uvs,
    cells,
    normals,
    quadCells,
  }
}
