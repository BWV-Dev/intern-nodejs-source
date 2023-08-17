#!/bin/bash

GITHUB_TOKEN=${github_token}
GIT_URL=${git_url}
sudo git clone https://username:$GITHUB_TOKEN@$GIT_URL /source

git config --global --add safe.directory /source

cd /source
sudo git checkout develop
sudo git pull origin develop

sudo docker-compose down -d
sudo docker-compose up -d --build
