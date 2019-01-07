import { QuadMesh } from '@tstackgl/types'

// from https://github.com/ataber/primitive-cylinder/blob/master/index.js
// but also with lateral quad

export function createCylinder(
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

  function generateCap(top: boolean) {
    const vertex = new Array(3).fill(0)

    const radius = top === true ? radiusTop : radiusBottom
    const sign = top === true ? 1 : -1

    const centerIndexStart = index

    for (let x = 1; x <= radialSegments; x++) {
      vertices[index] = [0, (height * sign) / 2, 0]
      normals[index] = [0, sign, 0]
      uvs[index] = [0.5, 0.5]
      index++
    }

    const centerIndexEnd = index

    for (let x = 0; x <= radialSegments; x++) {
      const u = x / radialSegments
      const theta = u * thetaLength
      const cosTheta = Math.cos(theta)
      const sinTheta = Math.sin(theta)
      vertices[index] = [radius * sinTheta, (height * sign) / 2, radius * cosTheta]
      normals[index] = [0, sign, 0]
      uvs[index] = [cosTheta * 0.5 + 0.5, sinTheta * 0.5 * sign + 0.5]
      index++
    }

    for (let x = 0; x < radialSegments; x++) {
      const c = centerIndexStart + x
      const i = centerIndexEnd + x

      if (top === true) {
        // face top
        cells[indexOffset] = [i, i + 1, c]
        indexOffset++
      } else {
        // face bottom
        cells[indexOffset] = [i + 1, i, c]
        indexOffset++
      }
    }
  }

  if (radiusTop > 0) {
    generateCap(true)
  }

  if (radiusBottom > 0) {
    generateCap(false)
  }

  return {
    positions: vertices,
    uvs,
    cells,
    normals,
    quadCells,
  }
}
