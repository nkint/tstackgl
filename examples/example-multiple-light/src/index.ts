import { start } from '@thi.ng/hdom'
import { canvasWebGL } from '@thi.ng/hdom-components/canvas'
import { hasWebGL } from '@thi.ng/checks'
import { createReglScene } from './scene'
import { createCommandAndProps } from './materials'
import { defaultMaterialsSpec } from './opengl-material-1997'
import { accordion, Section, AccordionType } from './accordion/accordion'
import { Event, BUS } from './state'

const panels: Section[] = createCommandAndProps.map(({ name }) => ({
  title: name,
  body: [['div', 'foo']],
}))

const materialPanel = (ctx: any) => {
  const ret: AccordionType = [
    accordion,
    (id: number) => {
      console.log('dudee')
      ctx.bus.dispatch([Event.TOGGLE_PANEL_SINGLE, id])
    },
    (id: number) => ctx.bus.state.value.panels[id],
    ...panels,
  ]

  return ret
}

const canvas = canvasWebGL(createReglScene())

const app = () => {
  const processed = ctx.bus.processQueue()
  // console.log('app render', { processed })

  const content = processed
    ? /*!hasWebGL()
      ? ['p', 'Your browser does not support WebGL :- (']
      : */ [
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
    : null

  return content
}

const ctx = {
  bus: BUS,
  theme: {
    accordion: {
      root: { class: 'mv3' },
      title: { class: 'pointer fw6 ma0 mt2 pv2 ph3 bb b--gray dim code' },
      bodyOpen: { class: 'gray bg-near-white pa3 mt2' },
      bodyClosed: { class: 'ph3' },
    },
  },
}
;(window as any).ctx = ctx

const hdomDispose = start(app, { ctx })
BUS.dispatch([Event.UPDATE_UI])

if ((module as any).hot) {
  ;(module as any).hot.dispose(() => {
    hdomDispose()
  })
}
