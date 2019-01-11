import { start } from '@thi.ng/hdom'
import { canvasWebGL } from '@thi.ng/hdom-components/canvas'
import { hasWebGL } from '@thi.ng/checks'
import { createReglScene } from './scene'
import { createCommandAndProps } from './materials'
import { defaultMaterialsSpec } from './opengl-material-1997'

const materialPanel = () => {
  return ['ul.list.pa0', createCommandAndProps.map(({ name }) => ['li.ma2.pointer', name])]
}

const canvas = canvasWebGL(createReglScene())

const app = () => {
  if (!hasWebGL()) {
    return ['p', 'Your browser does not support WebGL :- (']
  }

  return [
    'div.w-100.h-100',
    ['p.ma0.pa2.code', 'light study'],
    [
      'div.vw-100.vh-100.flex',
      /* */
      ['div.w5.pa2.pt3', materialPanel],
      /* */
      ['div.w-100.vh-100', [canvas]],
      /* */
    ],
  ]
}

const hdomDispose = start(app())

if ((module as any).hot) {
  ;(module as any).hot.dispose(() => {
    hdomDispose()
  })
}
