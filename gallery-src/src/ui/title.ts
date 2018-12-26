export const title = (ctx: any, text: string) => [
  'h1.s-black',
  { style: { 'font-weight': 100, 'line-height': '1.2em', 'font-size': '2.5rem' } },
  text[0],
  text.slice(1),
  console.log({ text }),
]
