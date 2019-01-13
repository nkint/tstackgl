import { start } from '@thi.ng/hdom'
import { canvasWebGL } from '@thi.ng/hdom-components/canvas'
import { hasWebGL } from '@thi.ng/checks'
import { createReglScene } from './scene'
import { createCommandAndProps } from './materials'
import { defaultMaterialsSpec } from './opengl-material-1997'
import { accordion, Section, AccordionType } from './accordion/accordion'
import { Event, BUS, lightParams } from './state'

type BodyType = { path: string; key: string }
const panels: Section[] = createCommandAndProps.map(({ name, path }) => {
  const pathKeys = lightParams.deref()[path]
  const keys = pathKeys ? Object.keys(pathKeys) : []
  return {
    title: name,
    body: keys.map(key => ({
      path,
      key,
    })),
  }
})

function slider(value: Number, onChange: (x: Number) => void) {
  return [
    'input',
    {
      type: 'range',
      value: value,
      oninput: (e: Event) => onChange(parseFloat((e.target as any).value)),
    },
  ]
}

const getPanels = () => {
  return panels.map(({ title, body }: { title: string; body: BodyType[] }) => {
    return {
      title,
      body: [
        body.length === 0
          ? ['div', 'no parameter']
          : body.map(({ path, key }, i) => {
              const item = lightParams.deref()[path]
              return [
                `div${i !== 0 ? '.mv2' : ''}`,
                ['div', `${key}: ${item[key]}`],
                [
                  slider(item[key], value => {
                    BUS.dispatch([Event.UPDATE_LIGHT_PARAM, { value, path, key }])
                  }),
                ],
              ]
            }),
      ],
    }
  })
}

const materialPanel = (ctx: any) => {
  const ret: AccordionType = [
    accordion,
    (id: number) => {
      ctx.bus.dispatch([Event.TOGGLE_PANEL_SINGLE, id])
    },
    (id: number) => ctx.bus.state.value.panels[id],
    ...getPanels(),
  ]

  return ret
}

const canvas = canvasWebGL(createReglScene())

const app = () => {
  const processed = ctx.bus.processQueue()

  const content = processed
    ? /*!hasWebGL()
      ? ['p', 'Your browser does not support WebGL :- (']
      : */ [
        'div.f7.code',
        [
          'div.w-100.h-100',
          ['p.ma0.pa2', 'light study'],
          [
            'div.vw-100.vh-100.flex',
            /* */
            ['div.w5.pa2.pt3', materialPanel],
            /* */
            ['div.w-100.vh-100', [canvas]],
            /* */
          ],
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
      title: { class: 'pointer fw6 ma0 mt2 pv2 ph3 bt b--gray dim' },
      bodyOpen: { class: 'gray pa3 mt2' },
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
