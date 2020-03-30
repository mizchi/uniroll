#!/usr/bin/env bash
git diff --exit-code --quiet templates/src
if [ 0 -ne $? ]; then
  git config --global user.email "CI@github"
  git config --global user.name "CI"
  git add templates/gen
  git commit -m "[CI] Gen templates/gen"
  echo gen
  # git push origin master
else
  echo no changes
fi
