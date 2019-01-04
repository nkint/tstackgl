import shell from 'shelljs'
shell.cd('../packages')
shell.ls('.', '-d').forEach(dir => {
  shell.cd(dir)
  shell.exec('yarn build')
  shell.cd('..')
})
console.log('Done')
