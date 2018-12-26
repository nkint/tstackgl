import { Atom } from '@thi.ng/atom'
import { start } from '@thi.ng/hdom'
import * as tx from '@thi.ng/transducers'
import * as icep from '@thi.ng/interceptors'
import data from './data.json'
import { title } from './ui/title'
import { paragraph } from './ui/paragraph'
import { link } from './ui/link'

const state = new Atom({
  selected: '',
})

const bus = new icep.EventBus(state, {
  init: () => ({
    [icep.FX_STATE]: { selected: '' },
  }),
  select: [icep.valueUpdater('selected', (_, y) => y)],
})

const navbar = () => {
  console.log('render navbar')
  const branch = tx.transduce(
    tx.map((datum: { title: string }) => [
      `p.pointer.s-light-grey.s-over${datum.title === state.value.selected ? '.b' : ''}`,
      {
        onclick: () => bus.dispatch(['select', datum.title]),
        style: {
          'font-family': 'Fantasque Sans Mono',
          'font-size': '1rem',
          height: '1.5rem',
          'line-height': '1.5rem',
          'padding-bottom': '1px',
        },
      },

      datum.title,
    ]),
    tx.push(),
    data,
  )
  return () => ['div.pa4.w5', [title, ['#tstack', 'span.s-light-grey', 'gl']], ['div', branch]]
}

const intro = [
  'div.pa5',
  [title, 'tstackgl'],
  [
    paragraph,
    `tstackgl is a monorepo containing experiments with typescript, `,
    [link, 'http://regl.party', 'regl'],
    ', ',
    [link, 'http://stack.gl', 'stack.gl ecosystem'],
    ' and ',
    [link, 'https://github.com/thi-ng/umbrella', '@thi.ng/umbrella'],
    '.',
  ],
]

const content = () => {
  console.log('render content', { selected: state.value.selected })
  return () => [
    'div.w-100.h-100',
    state.value.selected === ''
      ? intro
      : [
          'iframe.w-100.h-100',
          {
            src: `./${state.value.selected}/index.html`,
            frameborder: 0,
            allowfullscreen: true,
          },
        ],
  ]
}

const app = () => {
  console.log('render app')
  return ['div.h-100.s-bg-white', ['div.h-100.flex', navbar(), content()]]
}

start(
  ({ bus, state }: { bus: icep.EventBus; state: typeof Atom }) =>
    bus.processQueue() ? app() : null,
  { ctx: { state, bus } },
)

// kick off
bus.dispatch(['init'])
