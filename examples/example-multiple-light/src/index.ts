import { start } from '@thi.ng/hdom'
import { canvasWebGL } from '@thi.ng/hdom-components/canvas'
import { hasWebGL } from '@thi.ng/checks'
import { createReglScene } from './scene'
import { createCommandAndProps } from './materials'
import { defaultMaterialsSpec } from './opengl-material-1997'
import { accordion, Section, AccordionType } from './accordion/accordion'
import { Event, BUS, lightParams } from './state'
import { EventBus } from './interceptors/event-bus'

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
console.log({ panels })

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
    // console.log({ body })

    return {
      title,
      body: [
        body.length === 0
          ? ['p', 'no parameter']
          : body.map(({ path, key }) => {
              // console.log(lightParams.deref(), path, key)
              const item = lightParams.deref()[path]
              // console.log({ item })
              return [
                'div',
                ['div', `path: ${path}, key: ${key}, value: ${item[key]}`],
                [
                  slider(item[key], value => {
                    BUS.dispatch([Event.UPDATE_LIGHT_PARAM, { value, path, key }])
                  }),
                ],
                // [
                //   'div',
                //   [
                //     'input',
                //     {
                //       type: 'number',
                //       value: item[key],
                //     },
                //   ],
                // ],
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
