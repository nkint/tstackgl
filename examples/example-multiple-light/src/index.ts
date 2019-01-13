import { start } from '@thi.ng/hdom'
import { canvasWebGL } from '@thi.ng/hdom-components/canvas'
import { createReglScene } from './scene'
import { createCommandAndProps } from './materials'
import { defaultMaterialsSpec } from './opengl-material-1997'
import { accordion } from './accordion/accordion'
import { Event, BUS, lightParams, lightParamsMinMax } from './state'
import { slider } from './slider'
import backgroundImage from './background.png'

const noParams = ['div', 'no parameter']
const params = (keys: string[], path: string) =>
  keys.map((key, i) => {
    const item = lightParams.deref()[path]
    return [
      `div${i !== 0 ? '.mv2' : ''}`,
      [
        slider(
          `${key}: ${item[key]}`,
          item[key],
          value => {
            BUS.dispatch([Event.UPDATE_LIGHT_PARAM, { value, path, key }])
          },
          lightParamsMinMax[path][key],
        ),
      ],
    ]
  })

const panels = () =>
  createCommandAndProps.map(({ name, path }) => {
    const pathKeys = lightParams.deref()[path]
    const keys = pathKeys ? Object.keys(pathKeys) : []
    return {
      title: name,
      body: [keys.length === 0 ? noParams : params(keys, path)],
    }
  })

const materialPanel = (ctx: any) =>
  accordion(
    ctx,
    id => ctx.bus.dispatch([Event.TOGGLE_PANEL_SINGLE, id]),
    id => ctx.bus.state.value.panels[id],
    ...panels(),
  )

const canvas = canvasWebGL(createReglScene())

const app = () => {
  const processed = ctx.bus.processQueue()
  const content = processed
    ? [
        'div.f7.code',
        [
          'div.w-100.h-100',
          ['p.ma0.pa2', 'light study'],
          [
            'div.vw-100.vh-100.flex',
            /* */
            ['div.w5.pa2.pt3', materialPanel],
            /* */
            [
              'div.w-100.vh-100',
              { style: { 'background-image': `url("${backgroundImage}")` } },
              [canvas],
            ],
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
      title: { class: 'pointer fw6 ma0 mt2 pv2 ph3 bb b--gray dim' },
      bodyOpen: { class: 'gray pa3 mt2 bb' },
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
