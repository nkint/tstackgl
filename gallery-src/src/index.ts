import { Atom } from '@thi.ng/atom'
import { start } from '@thi.ng/hdom'
import * as tx from '@thi.ng/transducers'
import * as icep from '@thi.ng/interceptors'
import data from './data.json'

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
      `p.pointer${datum.title === state.value.selected ? '.b' : ''}`,
      { onclick: () => bus.dispatch(['select', datum.title]) },
      datum.title,
    ]),
    tx.push(),
    data,
  )
  return () => ['div.ba', ['div.w5', branch]]
}

const title = (ctx: any, text: string) => [
  'h1.s-black',
  { style: { 'font-weight': 100, 'line-height': '1.2em', 'font-size': '2.5rem' } },
  text,
]

const paragraph = (...args: Array<any>) => [
  //
  'p.s-grey',
  {
    style: {
      'font-family': 'Fantasque Sans Mono',
      'font-weight': 100,
      'font-size': '0.9rem',
      'line-height': '1.6em',
    },
  },
  ...args.slice(1),
]

const link = (ctx: any, href: string, text: string) => [
  'a.s-blue',
  {
    href,
    style: {
      'text-decoration': 'none',
      background: 'linear-gradient(to bottom, transparent 0%, #66C4FF 1%) repeat-x',
      'background-size': '1px 1px',
      'background-position': 'left bottom',
    },
  },
  text,
]

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
    'div.ba.w-100.h-100',
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
