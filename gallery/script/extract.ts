import fs from 'fs'
import path from 'path'

const EXAMPLE_PATH = '../../examples'

const examples = fs
  .readdirSync(EXAMPLE_PATH)
  .filter(n => n.indexOf('example-') === 0)
  .filter(exampleName => {
    const exampleContent = fs.readdirSync(path.join(EXAMPLE_PATH, exampleName))
    return exampleContent.includes('package.json')
  })
  .map(title => ({
    title,
  }))

console.log(JSON.stringify(examples, null, 2))
