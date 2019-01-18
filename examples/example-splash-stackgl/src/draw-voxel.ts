import createREGL from 'regl'
import heightmapVert from './shader/voxel.vert'
import heightmapFrag from './shader/voxel.frag'
import { Vec2, Mat4 } from '@tstackgl/types'

export type PropsVoxel = {
  uResolution: Vec2
  uViewRotation: Mat4
  uProjection: Mat4
  uModel: Mat4
  uView: Mat4
  tHeightmap: createREGL.Framebuffer2D
  tGradient: createREGL.Texture2D
}

type Uniforms = PropsVoxel

type Attributes = {
  aPosition: Float32Array
  aCentroid: Float32Array
  aNormal: Float32Array
  aEdge: Float32Array
}

export const createDrawVoxel = (
  regl: createREGL.Regl,
  voxel: {
    positions: Float32Array
    centroids: Float32Array
    normals: Float32Array
    edges: Float32Array
  },
) => {
  console.log({ voxel })
  const draw = regl<Uniforms, Attributes, PropsVoxel>({
    vert: heightmapVert,
    frag: heightmapFrag,

    attributes: {
      aPosition: voxel.positions,
      aCentroid: voxel.centroids,
      aNormal: voxel.normals,
      aEdge: voxel.edges,
    },

    uniforms: {
      uResolution: regl.prop<PropsVoxel, 'uResolution'>('uResolution'),
      uViewRotation: regl.prop<PropsVoxel, 'uViewRotation'>('uViewRotation'),
      uProjection: regl.prop<PropsVoxel, 'uProjection'>('uProjection'),
      uModel: regl.prop<PropsVoxel, 'uModel'>('uModel'),
      uView: regl.prop<PropsVoxel, 'uView'>('uView'),
      tHeightmap: regl.prop<PropsVoxel, 'tHeightmap'>('tHeightmap'),
      tGradient: regl.prop<PropsVoxel, 'tGradient'>('tGradient'),
    },

    count: voxel.positions.length / 3,

    cull: {
      enable: true, // why this is so important??
    },
  })

  return { draw }
}
