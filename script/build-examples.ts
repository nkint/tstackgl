import shell from 'shelljs'
import fs from 'fs'

shell.cd('../examples')
shell.ls('.', '-d').forEach(dir => {
  shell.cd(dir)
  if (fs.existsSync('package.json')) {
    shell.exec('yarn build')
  }
  shell.cd('..')
})
console.log('Done')
