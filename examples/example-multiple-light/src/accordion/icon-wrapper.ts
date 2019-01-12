/**
 * Not a component. Wraps given SVG icon in a fixed size span and
 * customizes fill color.
 *
 * @param icon
 * @param fill
 * @param width
 * @param attribs
 */
export const iconWrapper = (
  icon: Array<{
    viewBox: string
    'fill-rule': string
  }>,
  fill: string,
  width: string,
  attribs: any = { class: 'mr2' },
) => [
  'span.dib.w1.h1',
  attribs,
  ['svg', { viewBox: icon[1].viewBox, fill, width, height: width }, ...icon.slice(2)],
]
