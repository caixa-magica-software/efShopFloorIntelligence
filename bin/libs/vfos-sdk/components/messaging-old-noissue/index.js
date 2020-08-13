#!/usr/bin/env node

amqp = require('amqplib');

/*
 * Debug mode
 *
 * Enable the logging of messages to the console
 * Disable in production!
 */
const DEBUG = false;

/*
 * Logging function
 */
function logDebug(msg) {
  if (!DEBUG) { return; }
  let logMsg = "vfosMessagingPubsub: " + msg;
  console.log(logMsg);
}


/*
 * Error loggin function
 */
function errLog(msg) {
  let errLogMsg = "vfosMessagingPubsub ERROR:" + msg;
  console.log(errLogMsg);
}

/*
 * Create Channel
 *
 * Use the given connection to create a channel
 */
function createChannel(connection) {
  return connection.createChannel()
  .catch(err => errLog(err));
}


/*
 * Connect
 *
 * Receive server address
 * Establish connection and create two channels
 * - The first to assert configurations in the broker
 * - One for sending or publishing messages
 * - Another for receiving or consuming
 */
function connect(commObj, server) {
  loginPromise = amqp.connect(server)
  .then(function(conn) {
    process.once('SIGINT', function() {
      logDebug("Closing AMQP connection");
      conn.close();
    });
    let configChannel = createChannel(conn);
    let inboundChannel = createChannel(conn);
    let outboundChannel = createChannel(conn);
    return Promise.all([ configChannel, inboundChannel, outboundChannel ])
    .then(function([ cCh, iCh, oCh ]) {
      commObj.configChannel = cCh;
      commObj.inboundChannel = iCh;
      commObj.outboundChannel = oCh;

      // TODO: Assert the exchanges via the configuration module on the next release
      let messagingExchangeProm = commObj.configChannel.assertExchange(commObj.messagingExchange, 'topic', {durable: true});
      let pubsubExchangeProm = commObj.configChannel.assertExchange(commObj.pubsubExchange, 'topic', {durable: true});

      return Promise.all([ messagingExchangeProm, pubsubExchangeProm ])
      .then(function() {
	return Promise.resolve();
      });
    });
  });
  commObj.loginPromise = loginPromise;
  return loginPromise;
}

/*
 * Disconnect
 *
 * Close connection to AMQP server
 */
function disconnect(connection) {
  logMsg("Closing AMQP connection");
  connection.close();
}

/*
 * Send message
 *
 * Generic send message method to be used by both Messaging and PubSub
 * Sends message with given content to a key
 * username should be the same as the class' this.name
 */
function sendMessage(commObj, exchange, key, content) {
  let timestamp = Date.now();
  return commObj.loginPromise
    .then(function() {
      return commObj.outboundChannel.publish(exchange, key, Buffer.from(content), {appId: commObj.username, timestamp: timestamp});
    })
    .then(function(){
      logDebug("Sent Message as " + commObj.username + " on " + key + " at " + timestamp + ": " + content.toString());
      return Promise.resolve();
    });
    //TODO: Replace appId with userId once the broker starts handling authentication
}

/*
 * Register a message receiver
 *
 * Generic method to be used by both Messaging and PubSub to retrieve messages
 * Calls for the creation of the message handler function
 * Consumes messages from the queue if registration has been successful
 */
function registerMessageReceiver(commObj, queue) {
  return commObj.registerPromise
  .then(function() {
    messageHandler = createMessageHandler(commObj);
    commObj.inboundChannel.consume(queue, messageHandler, commObj.consumeRules);
  });
}

/*
 * Create Message Handler
 *
 * Creates an anonymous function that will be delivered as callback to amqplib.consume
 * which includes references to processMessage and the instance's messageHandlerCallback
 */
function createMessageHandler(commObj) {
  return function(msg) {
    processedMessage = processMessage(msg);
    commObj.messageHandlerCallback(processedMessage);
  };
}

/*
 * Bind queue with a single key
 *
 * Bind a queue to an exchange with a single key
 */
function bindQueueKey(commObj, queue, exchange, key) {
  return commObj.loginPromise
  .then(function() {
    commObj.configChannel.bindQueue(queue, exchange, key);
  })
  .then(function() {
    logDebug("Bound " + queue + " to " + exchange + " with " + key);
  });
}

/*
 * Bind queue with multiple keys
 *
 * Iterate through an array of keys and bind the queue to the exchange
 * using every single one of them
 */
function bindQueueMultipleKeys(commObj, queue, exchange, keys) {
  return Promise.all(keys.map(function(singleKey) {
    return bindQueueKey(commObj, queue, exchange, singleKey);
  }));
}

/*
 * Generate Private key
 *
 * Given the username and prefix, generate a private key string
 */
function generatePrivateKey(prefix, username) {
  return prefix + '.' + 'component' + '.' + username;
}

/*
 * Process Message
 *
 * Given an AMQP message object, return it in an abridged format
 * Fields:
 *  `- routingKey: String with the routing key of the message
 *  `- id: ID of the sender
 *  `- content: Content of the message
 *  `- timestamp: Unix time of sending
 *  `- length: Length of the message
 */
function processMessage(msg) {
  let outputMessage = {};

  if (!msg) {
    errLog("No message to process.");
    return;
  }

  outputMessage.routingKey = msg.fields.routingKey;
  outputMessage.id = msg.properties.appId;
  outputMessage.content = msg.content;
  outputMessage.timestamp = msg.properties.timestamp;
  outputMessage.length = msg.content.length;

  logDebug("Message processed: " + JSON.stringify(outputMessage));

  return outputMessage;
}

/*
 *
 * vfosMessagingPubsub Class
 *
 */
class vfosMessagingPubsub {

  /*
   * Class constructor
   *
   * Assign default variables and configs
   * Login
   * Register
   */
  constructor(server='localhost', username='guest', prefix='com.vfos', keys=["#"]) {
    this.username = username;
    this.server = server;
    this.prefix = prefix;

    // Exchange names
    this.messagingExchange = 'messaging';
    this.pubsubExchange = 'pubSub';

    // Queue names
    this.messagingQueue = this.username + '_messaging';
    this.pubsubQueue = this.username + '_pubsub';

    // Queue rules
    this.messagingQueueRules = {durable: true};
    this.pubsubQueueRules = {durable: true};

    // Consume rules
    this.consumeRules = {noAck: true};

    // Channel pointers
    var configChannel, inboundChannel, outboundChannel;

    // Login and register automatically when creating an instance
    this.login();
    this.register(keys);
  }

  /*
   * Log into the Messaging/PubSub system
   *
   * Connect to the broker
   * Create one input and one output channels
   * Send a notification to the system
   */
  login() {
    let commObj = this;
    return connect(commObj, this.server)
    .then(function() {
      logDebug("Logged in to the Messaging/PubSub system as " + commObj.username);
      return commObj.sendPublicationAnnouncement("login", "");
    });
  }

  /*
   * Log out of the Messaging/PubSub system
   *
   * Send a notification to the system
   * Remove both channels
   * Disconnect from the broker
   */
  logout() {
    let commObj = this;

    return commObj.loginPromise
    .then(function() {
      let logoutAnnouncementProm = commObj.sendPublicationAnnouncement("logout");
      let configChannelCloseProm = commObj.configChannel.close();
      let inboundChannelCloseProm = commObj.inboundChannel.close();
      let outboundChannelCloseProm = commObj.outboundChannel.close();

      return Promise.all([logoutAnnouncementProm, configChannelCloseProm, inboundChannelCloseProm, outboundChannelCloseProm])
      .then(function() {
	logDebug("Logged out to the Messaging/PubSub system");
	return disconnect(this.connection);
      });
    });
  }

  /*
   * Register on the Messaging/PubSub system
   *
   * Create two queues, one for Messaging and another for PubSub
   * Bind the Messaging queue with the module name
   * Bind the PubSub queue with the routing keys
   * Send a notification to the system
   */
  register(keys) {
    let commObj = this;

    let registerPromise = commObj.loginPromise
      .then(function(){
	let messagingProm = commObj.configChannel.assertQueue(commObj.messagingQueue, commObj.messagingQueueRules);
	let pubSubProm = commObj.configChannel.assertQueue(commObj.pubsubQueue, commObj.pubsubQueueRules);
       return Promise.all([messagingProm, pubSubProm]);
      })
      .then(function(){

	let messagingBindProm = bindQueueKey(commObj, commObj.messagingQueue, commObj.messagingExchange, generatePrivateKey(commObj.prefix, commObj.username));
	let pubSubBindProm = bindQueueMultipleKeys(commObj, commObj.pubsubQueue, commObj.pubsubExchange, keys);

	return Promise.all([messagingBindProm, pubSubBindProm]);
      })
      .then(function(){
	commObj.isRegistered = true;
	return commObj.sendPublicationAnnouncement("register", keys);
      });

    this.registerPromise = registerPromise;

    return registerPromise;
  }

  /*
   * Unregister from the Messaging/PubSub system
   *
   * Send a notification to the system
   * Remove both Messaging and PubSub queues from the broker
   */
  unregister() {
    let commObj = this;

    let unregisterPromise = commObj.registerPromise
    .then(function() {
      let messagingProm = commObj.configChannel.deleteQueue(commObj.messagingQueue);
      let pubSubProm = commObj.configChannel.deleteQueue(commObj.pubsubQueue);

      return Promise.all([messagingProm, pubSubProm])
      .then(function() {
	logDebug("Unregistered from the Messaging/PubSub system");
	return commObj.sendPublicationAnnouncement("unregister");
      });
    });
    return unregisterPromise;
  }

  /*
   * Change Subscriptions
   *
   * Rebind the PubSub queue with the given routing keys
   */
  changeSub(keys) {
    bindQueueMultipleKeys(this.configChannel, this.pubsubQueue, this.pubsubExchange, keys);

    logDebug("Changed PubSub routing keys to: " + keys);
  }

  /*
   * Send Message
   *
   * Send a private message to a destination on a certain prefix
   */
  sendPrivateMessage(prefix, dest, content) {
    let commObj = this;
    return commObj.loginPromise
    .then(function() {
      return sendMessage(commObj, commObj.messagingExchange, generatePrivateKey(prefix, dest), content);
    });
  }

  /*
   * Send Publication
   *
   * Publish a message with the given key
   */
  sendPublication(key, content) {
    let commObj = this;
    return commObj.loginPromise
    .then(function() {
      return sendMessage(commObj, commObj.pubsubExchange, key, content);
    });
  }

  /*
   * Send announcement message
   *
   * Publish a message in the announcement key
   */
  sendPublicationAnnouncement(type, content="") {
    let announcementKey = this.prefix + '.announcements.' + type;

    let announcementMessage;
    switch (type) {
      case "login":
	announcementMessage = this.username + " has logged in";
      break;
      case "logout":
	announcementMessage = this.username + " has logged out";
      break;
      case "register":
	announcementMessage = this.username + " has registered with: " + content;
      break;
      case "unregister":
	announcementMessage = this.username + " has unregistered";
      break;
    }

    return this.sendPublication(announcementKey, announcementMessage);
  }

  /*
   * Register a private message receiver
   *
   * Launches a private message receiver with a callback to handle incoming messages
   */
  registerPrivateMessageReceiver(callback) {
    this.messageHandlerCallback = callback;
    return registerMessageReceiver(this, this.messagingQueue);
  }

  /*
   * Register a publication receiver
   *
   * Launches a publication receiver with a callback to handle incoming messages
   */
  registerPublicationReceiver(callback) {
    this.messageHandlerCallback = callback;
    return registerMessageReceiver(this, this.pubsubQueue);
  }

}

module.exports = vfosMessagingPubsub;
