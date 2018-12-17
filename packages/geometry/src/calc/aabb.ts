import { Vec3 } from '@tstackgl/types'

// TODO: use this instead : https://github.com/mikolalysenko/bound-points

export function AABBfromPoints<T extends Array<number>>(positions: Array<T>): [T, T] {
  // https://github.com/thibauts/vertices-bounding-box
  if (positions.length === 0) {
    return null
  }

  var dimensions = positions[0].length
  var min = new Array(dimensions)
  var max = new Array(dimensions)

  for (var i = 0; i < dimensions; i++) {
    min[i] = Infinity
    max[i] = -Infinity
  }

  positions.forEach(function(position) {
    for (var i = 0; i < dimensions; i++) {
      max[i] = position[i] > max[i] ? position[i] : max[i]
      min[i] = position[i] < min[i] ? position[i] : min[i]
    }
  })

  return [min, max] as [T, T]
}

export function computeBBoxFromAABB([min, max]: [Vec3, Vec3]) {
  // see https://github.com/mrdoob/three.js/blob/master/src/helpers/BoxHelper.js

  /*
		  5____4
		1/___0/|
		| 6__|_7
    2/___3/
    
		0: max.x, max.y, max.z
		1: min.x, max.y, max.z
		2: min.x, min.y, max.z
		3: max.x, min.y, max.z
		4: max.x, max.y, min.z
		5: min.x, max.y, min.z
		6: min.x, min.y, min.z
    7: max.x, min.y, min.z
    
	*/

  const boxPositions: Array<Vec3> = new Array<Vec3>(8)

  boxPositions[0] = [max[0], max[1], max[2]]
  boxPositions[1] = [min[0], max[1], max[2]]
  boxPositions[2] = [min[0], min[1], max[2]]
  boxPositions[3] = [max[0], min[1], max[2]]
  boxPositions[4] = [max[0], max[1], min[2]]
  boxPositions[5] = [min[0], max[1], min[2]]
  boxPositions[6] = [min[0], min[1], min[2]]
  boxPositions[7] = [max[0], min[1], min[2]]

  return boxPositions
}
