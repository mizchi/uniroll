#!/usr/bin/env bash
# TODO: Update only new src
git diff --exit-code --quiet templates/src
# if [ 0 -ne $? ]; then
git config --global user.email "CI@github"
git config --global user.name "CI"
git add templates/gen
git commit --allow-empty -m "[CI] Gen templates/gen"
  # git push origin master
# else
#   echo no changes
# fi
