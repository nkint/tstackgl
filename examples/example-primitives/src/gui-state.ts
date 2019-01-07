export type DrawMode = 'normals' | 'wireframes' | 'lights'

export const guiState: { drawMode: DrawMode; dirty: boolean } = {
  drawMode: 'normals',
  dirty: true,
}

export const guiActions = {
  buildOnchange: (n: DrawMode): void => {
    guiState.drawMode = n
    guiState.dirty = true
  },
}
