export function slider(
  label: string,
  value: Number,
  onChange: (x: Number) => void,
  opts: { min: Number; max: Number; step: Number },
) {
  return [
    'div',
    ['div', label],
    [
      'input',
      {
        type: 'range',
        value: value,
        oninput: (e: Event) => onChange(parseFloat((e.target as any).value)),
        ...opts,
      },
    ],
  ]
}
