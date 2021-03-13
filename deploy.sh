#!/usr/bin/env bash

cd app
haml index.haml > index.html
cd ..

scp -r app pw:/var/www/daily_schedule/