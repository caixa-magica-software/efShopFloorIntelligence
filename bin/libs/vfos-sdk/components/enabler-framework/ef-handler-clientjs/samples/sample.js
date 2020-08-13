const async = require('async');
const express = require('express');
const router = express.Router();

var ef = require('../index');

var framework = new ef();

let vappId = "vappId";

function listOrionEntities(){
    let orionName = "orion";
    let orionVersion = "2";
    let orionInstance = "test1";
    let orionService1 = "listEntities";

    return framework.accessFunctionality(vappId, orionName, orionVersion, orionInstance, orionService1, null, null)
    .then(function(result){
        return new Promise(function(resolve, reject) {
            if (result.results && result.results.length==0){
              console.log("Orion context broker is empty");
            } else if (result.results && result.results.length>0){
              console.log(result.results);
            } else{
              console.log("Error while getting the orion entities");
              reject();
            }
            resolve();
        });
    })
    .catch(err => console.log(err));
}

function createOrionEntity(){
    let orionName = "orion";
    let orionVersion = "2";
    let orionInstance = "test1";
    let orionService1 = "createEntity";
    let bodyParams={"entity":{"id":"Room2","pressure":{"metadata":{},"type":"Integer","value":720},"temperature":{"metadata":{},"type":"Float","value":23},"type":"Room"}};


    return framework.accessFunctionality(vappId, orionName, orionVersion, orionInstance, orionService1, bodyParams, null)
    .catch(function(err){
        console.log(err)
        if (err.statusCode == 500 && err.error && err.error.error && err.error.error.name === "AlreadyExists"){
            console.log("Entity already exists.");
            return Promise.resolve();
        } else {
            return Promise.reject();
        }
    });
}

createOrionEntity()
