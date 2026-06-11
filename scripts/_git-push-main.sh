#!/bin/bash
set -e
cd /mnt/c/Users/adrie/auros
export GIT_SSH_COMMAND="ssh -i $HOME/.ssh/id_ed25519_auros -o StrictHostKeyChecking=accept-new"
git push -u origin main
git branch -vv