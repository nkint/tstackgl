import { start } from '@thi.ng/hdom'
import { canvasWebGL } from '@thi.ng/hdom-components/canvas'
import { hasWebGL } from '@thi.ng/checks'
import { createReglScene1 } from './scene1'

const app = () => {
  console.log('app')

  if (!hasWebGL()) {
    return ['p', 'Your browser does not support WebGL :- (']
  }

  const canvas = canvasWebGL(createReglScene1())

  return [
    'div.h-100.flex.flex-column',
    ['p.ma0.pa2.code', 'TRS - translate rotate scale'],
    ['div.h-100', [canvas, 200, 0.025]],
  ]
}

start(app())
