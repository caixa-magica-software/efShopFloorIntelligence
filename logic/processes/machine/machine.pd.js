const sdk = require('../../../bin/libs/vfos-sdk/sdk-include');
const express = require('express');
const moment = require('moment');
const router = express.Router();


const vfosMessagingPubsub = sdk.messaging;
const broker = sdk.config.MESSAGING_PUBSUB.SERVER_URL;
const userName = "events";
const domain = "eu.efactory.wp5.review.events";
const routingKeys = ["eu.efactory.wp5.#"];


/**
 * 
 *  begging of section to archive messaging from a topic
 */
var communications = new vfosMessagingPubsub(broker, userName, domain, routingKeys);

function messageHandler(msg) {
    if(domain.includes(msg.routingKey))
	console.log("> messageHandler: msg.content = \"" + msg.content.toString() + "\"");
}

var event;
const parts = ["A", "B", "C", "D", "E"];
var partNumber;

setTimeout(sendMessageViaMessage, (Math.floor(Math.random() * 40) + 20) * 1000)
function sendMessageViaMessage() {
	console.info('sending new messaging over topic ', domain);
	console.log(event)
	event = event == null ? "start" : event == "start" ? "stop" : "start"
	partNumber = event == "start" ? Math.floor(Math.random() * 5) : partNumber
	console.log(event)
	message = {
        "timestamp": moment(Date()).format('YYYY-MM-DD HH:mm:ss'),
        "machineId": "machine10",
        "productionEvent": {
            "event": event,
            "batch": "1245",
            "productId": "abcd123",
            "productTypeCode": parts[partNumber]
        }
    }
	communications.sendPublication(domain, JSON.stringify(message));
	setTimeout(sendMessageViaMessage, (Math.floor(Math.random() * 40) + 20) * 1000)
}

module.exports = (app) => router;