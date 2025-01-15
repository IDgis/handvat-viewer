#!/bin/bash

echo building docker image of handvat-viewer...

if [ -z "$1" ]; then
    echo no tag provided
    exit 1
fi

docker build -t idgis/handvat-viewer:$1 .
