#!/bin/bash
fuser -k 2030/tcp
cd /var/www/html/kn_private_api/
nohup node src/server_kn.js & > /var/www/html/kn_private_api/nohup.out

