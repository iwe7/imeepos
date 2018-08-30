#!/bin/bash
pm2 flush
pm2 kill
pm2 start --name=iwe8-build ng -- run iwe8:build
pm2 start --name=imeepos-cli-build ng -- run imeepos-cli:build
