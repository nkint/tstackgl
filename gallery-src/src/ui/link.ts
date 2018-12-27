export const link = (ctx: any, href: string, text: string) => [
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
