#!/usr/bin/env sh

set -e

npm run build

cd dist

touch .nojekyll

git init
git checkout -B main
git add -A
git commit -m 'deploy'

git push -f git@github.com:iluxaBoy/Management-app-vue.git main:gh-pages

cd -
