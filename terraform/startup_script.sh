#!/bin/bash
sudo apt update
sudo apt install -y apache2
sudo systemctl start apache2
sudo bash -c 'echo "<h1>Welcome to AutoScaleHost - ${HOSTNAME}</h1>" > /var/www/html/index.html'