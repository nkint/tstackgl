import fs from 'fs'
import path from 'path'
import shell from 'shelljs'

const EXAMPLE_PATH = '../examples'
const GALLERY_DIST_PATH = '../gallery-dist'

const examples = fs
  .readdirSync(EXAMPLE_PATH)
  .filter(n => n.indexOf('example-') === 0)
  .filter(exampleName => {
    const exampleContent = fs.readdirSync(path.join(EXAMPLE_PATH, exampleName))
    return exampleContent.includes('package.json')
  })
  .map(async function(dirName) {
    const inDir = path.join(EXAMPLE_PATH, dirName, 'dist')
    const outDir = path.join(GALLERY_DIST_PATH, dirName)
    shell.mkdir(outDir)
    shell.cp(`${inDir}/*`, outDir)

    const indexPath = path.join(outDir, 'index.html')

    await new Promise((resolve, reject) => {
      fs.readFile(indexPath, 'utf8', function(err, data) {
        if (err) {
          return reject(err)
        }
        var result = data.replace(
          '<script type="text/javascript" src="',
          '<script type="text/javascript" src=".',
        )

        fs.writeFile(indexPath, result, 'utf8', function(err) {
          if (err) return reject(err)
          resolve()
        })
      })
    })
  })

Promise.all(examples).then(() => console.log('end'))

console.log({ examples })
