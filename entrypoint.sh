#!/bin/sh

node .vfos-deploy-hda.js
sed -i "s/frontend_editor/app/$ASSET_NAME/g" views/index.html
npm start