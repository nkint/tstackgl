export const paragraph = (...args: Array<any>) => [
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
