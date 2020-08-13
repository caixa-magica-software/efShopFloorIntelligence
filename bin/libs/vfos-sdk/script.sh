#/bin/bash

##This script is for download the repo from opensource project we need to fix an issues in opensource projects to be able to install depencies within package.json

path="components"

#check if the folder not exist
if [ ! -d "$path" ]; then
  echo "folder didnt exist should create"
  mkdir $path
fi

#check if the folder not exist
if [ ! -d "components/vfos-messaging" ]; then
  echo "vfos-messaging not imported"
  messaging="https://engagementhub.caixamagica.pt/virtual-factory-operating-system/middleware/publish-subscribe/lib-messaging-pub-sub-js.git vfos-messaging"
  cd $path
  git clone $messaging
fi

#check if the folder not exist
if [ ! -d "components/restheart-js-client" ]; then
  echo "restheart-js-client not imported"
  restheart="https://github.com/masterviana/restheart-js-client.git"
git clone -b vfos $restheart
fi

#enablers framework
# enablersf="--recurse-submodules http://git-gris.uninova.pt/vfos/enablers-framework.git vfos-enablers-framework"
# cd $path
# git clone $enablersf
