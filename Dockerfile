FROM node:alpine

ENV ASSET_NAME="efShopFloorIntelligence"

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

COPY . .

RUN npm install
RUN chmod +x entrypoint.sh

EXPOSE 4201

LABEL vf-OS=true
LABEL vf-OS.frontendUri=/efShopFloorIntelligence/
LABEL vf-OS.icon=img/2.png
LABEL vf-OS.urlprefixReplace=true
LABEL vf-OS.compose.0.depends_on.0="rabbitmq"

ENTRYPOINT ["/usr/src/app/entrypoint.sh"]
