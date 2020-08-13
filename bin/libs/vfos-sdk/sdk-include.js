module.exports = {
  messaging: require("./components/vfos-messaging/index.js"),
  messagingNoIssue: require("./components/messaging-old-noissue/index.js"),
  security: require('./src/lib/Security'),
  config : require('./sdk-config.json'),
  datastorageNosql: require('./components/restheart-js-client'),
  datastorageRelational: require('./components/datastorage-nodejs-client')
}