import { HEADER_CHEVRON } from '@thi.ng/hiccup-carbon-icons/header-chevron'
import { HEADER_CLOSE } from '@thi.ng/hiccup-carbon-icons/header-close'
import { iconWrapper } from './icon-wrapper'

export type Section = { title: string; body: any }
type OnClick = (id: number) => void
type PanelOpen = (id: number) => boolean

export type AccordionType = [
  (ctx: any, onclick: OnClick, panelOpen: PanelOpen, ...sections: Section[]) => any[],
  (id: number) => void,
  (id: number) => void,
  ...Section[]
]

/**
 * Context-themed accordion component. Takes an `onclick` event handler
 * and `panelOpen` predicate (both of which are only being given a panel
 * ID) and any number of panel objects of `{ title, body }`.
 *
 * @param ctx
 * @param onclick
 * @param panelOpen
 * @param sections
 */
export const accordion = (
  ctx: any,
  onclick: OnClick,
  panelOpen: PanelOpen,
  ...sections: Array<Section>
) => {
  if (!ctx.theme) {
    const themeExample = {
      accordion: {
        root: { class: 'string' },
        title: { class: 'string' },
        bodyOpen: { class: 'string' },
        bodyClosed: { class: 'string' },
      },
    }
    throw new Error(
      `Accordion component needs theme as object: ${JSON.stringify(themeExample, null, 2)}`,
    )
  }
  return [
    'div',
    ctx.theme.accordion.root,
    sections.map((panel, i) => [accordionPanel, onclick, i, panelOpen(i), panel]),
  ]
}

const accordionPanel = (
  ctx: any,
  onclick: OnClick,
  id: number,
  open: boolean,
  { title, body }: Section,
) => [
  'div',
  [
    'h4',
    { ...ctx.theme.accordion.title, onclick: () => onclick(id) },
    iconWrapper(open ? HEADER_CLOSE : (HEADER_CHEVRON as any), '#555', '80%'),
    title,
  ],
  open
    ? ['div.panel.panel-active', ['div.content', ctx.theme.accordion.bodyOpen, ...body]]
    : ['div.panel', ['div.content', ctx.theme.accordion.bodyClosed]],
]
