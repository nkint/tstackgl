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

const content = () => {
  console.log('render content', { selected: state.value.selected })
  return () => [
    'div.ba.w-100.h-100',
    [
      'iframe.w-100.h-100',
      {
        src: `./examples/${state.value.selected}/index.html`,
        frameborder: 0,
        allowfullscreen: true,
      },
    ],
  ]
}

const app = () => {
  console.log('render app')
  return ['div.h-100', ['div.h-100.flex', navbar(), content()]]
}

start(
  ({ bus, state }: { bus: icep.EventBus; state: typeof Atom }) =>
    bus.processQueue() ? app() : null,
  { ctx: { state, bus } },
)

// kick off
bus.dispatch(['init'])
