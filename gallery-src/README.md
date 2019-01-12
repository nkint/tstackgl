this folder contains the gallery hosted in gh-pages.

process:

```sh
$ cd PATH_TO_TSTACKGL/gallery-src
# genereate the data.json to build the navbar items
$ ts-node ./script/extract.ts > ./src/data.json
# build (compile, minify, etc) the gallery website writte with the hdom library
$ yarn build
# exectue a script that prepares all the examples to be accessible via iframe in the github pages
$ ts-node ./script/prepare-examples.ts
# let git know that we are ready to deploy github pages..
$ git add ../gallery-dist && git commit -m "new changes in the gallery.."
# push only the `gallery-dist` folder in to the gh-pages  branch
$ yarn deploy
```
