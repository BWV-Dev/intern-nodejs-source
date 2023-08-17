#!/bin/bash

ENV=${env}
sudo yum update -y

if [ "$ENV" == "node" ]; then
  # Install Node.js
  curl -sL https://rpm.nodesource.com/setup_14.x | sudo bash -
  sudo yum install -y nodejs

  # Install Docker
  sudo yum install -y docker

  # Start Docker and enable auto-start on boot
  sudo systemctl start docker
  sudo systemctl enable docker

  # Optional: Add the current user to the "docker" group to avoid using "sudo" for Docker commands
  sudo usermod -aG docker $USER

  sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
  sudo chmod +x /usr/local/bin/docker-compose


  # Start your Node.js application or perform other setup tasks...
else
    return
fi

# install git
sudo yum install git -y
