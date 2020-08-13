var request = require('request-promise-native');
const fieldMissing = " must be defined";

var enablerRegistryEndPoint = require("../../../sdk-config.json").ENABLER_FRAMEWORK.ENABLERREGISTRY;
var requestHandlerEndPoint = require("../../../sdk-config.json").ENABLER_FRAMEWORK.REQUESTHANDLER;

function hasMandatoryFields (enablerName, serviceName, versionNumber, instanceName){
  return new Promise(function(resolve, reject) {
    if(!enablerName){
      reject("enablerName" + fieldMissing);
    } else if (!serviceName) {
      reject("serviceName");
    } else if (!versionNumber) {
      reject("versionNumber" + fieldMissing);
    } else if (!instanceName) {
      reject("instanceName" + fieldMissing);
    } else {
      resolve();
    }
  });
}

class EnablersFramework {
  constructor() {
    this.urlRegistry = enablerRegistryEndPoint;
    this.urlRequestHandler = requestHandlerEndPoint;
  }

  accessFunctionality(vappId, enablerName, versionNumber, instanceName, serviceName, bodyParams="", urlParams="") {
    let options = {
      url: this.urlRequestHandler + '/accessfunctionality/' + enablerName + '/' + versionNumber + '/' + instanceName + '/' + serviceName,
      body: {
        "vapp": vappId,
        "bodyParams": bodyParams,
        "urlParams": urlParams
      },
      json: true
    };

    return hasMandatoryFields(enablerName, serviceName, versionNumber, instanceName)
    .then(() => request.post(options));

  }

  getServicesFromEnabler(enablerName, versionNumber){
    if(!enablerName){
      return new Promise.reject("enablerName" + fieldMissing);
    } else if (!versionNumber){
      return new Promise.reject("versionNumber" + fieldMissing);
    }

    let options = {
      url: this.urlRegistry + '/enablers/' + enablerName + '/versions/' + versionNumber + '/' + 'services',
      json: true
    };

    return request.get(options);
  }
}

module.exports = EnablersFramework;
