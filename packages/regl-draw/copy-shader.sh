echo ------------------------------ copy files
rsync -rv --include=\"*/\" --include='*.'{vert,frag} --exclude=\"*\" ./src/* ./dist
sleep .5
echo ------------------------------ compile shader
find ./dist -type f \( -name "*.vert" -or -name "*.frag" \) -exec ./node_modules/.bin/glslify {} -o {} \;
sleep .5
echo ------------------------------ ok
