#!/bin/bash

docker-compose up -d --build

IP=$(hostname -I | awk '{print $1}')

echo "http://$IP:3000"
