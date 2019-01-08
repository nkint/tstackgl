import { start } from '@thi.ng/hdom'
import { canvasWebGL } from '@thi.ng/hdom-components/canvas'
import { hasWebGL } from '@thi.ng/checks'
import { createReglScene } from './scene'

const app = () => {
  if (!hasWebGL()) {
    return ['p', 'Your browser does not support WebGL :- (']
  }

  const canvas = canvasWebGL(createReglScene())

  return [
    'div.h-100.flex.flex-column.code',
    ['p.ma0.pa2', 'light study'],
    ['div.h-100', [canvas, 200, 0.025]],
  ]
}

const hdomDispose = start(app())

if ((module as any).hot) {
  ;(module as any).hot.dispose(() => {
    hdomDispose()
  })
}
