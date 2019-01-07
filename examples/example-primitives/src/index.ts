import { start } from '@thi.ng/hdom'
import { canvasWebGL } from '@thi.ng/hdom-components/canvas'
import { hasWebGL } from '@thi.ng/checks'
import { guiState, DrawMode, guiActions } from './gui-state'
import { createReglScene } from './scene'

const checkbox = (_: any, title: DrawMode) => {
  return [
    'div.ma2',
    [
      'input',
      {
        type: 'checkbox',
        name: `${title}`,
        id: `${title}`,
        onchange: () => guiActions.buildOnchange(title),
        checked: guiState.drawMode === title,
      },
    ],
    ['label.ma2', { for: title }, title],
  ]
}

const app = () => {
  if (!hasWebGL()) {
    return ['p', 'Your browser does not support WebGL :- (']
  }

  const canvas = canvasWebGL(createReglScene())

  return [
    'div.h-100.flex.flex-column.code',
    ['p.ma0.pa2', 'mesh primitives'],
    [checkbox, 'normals'],
    [checkbox, 'wireframes'],
    [checkbox, 'lights'],
    ['div.h-100', [canvas, 200, 0.025]],
  ]
}

const hdomDispose = start(app())

if ((module as any).hot) {
  ;(module as any).hot.dispose(() => {
    hdomDispose()
  })
}
