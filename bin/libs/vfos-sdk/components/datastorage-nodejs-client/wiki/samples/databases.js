/**
 * 
 * Samples and testing create table in datastorage
 * 
 */
let async = require('async');
let Database = require('../../index.js').Database;
let security = require('../security');

let auth = 'Basic cG9zdGdyZXM6dmZvcw==';
let DatabaseName = "databaseSDK_script_test"


var Operations = function () {

}

Operations.prototype = {

  add: function (DatabaseName, auth, next) {
    Database.addDatabase(DatabaseName, auth, (err, data) => {
      if (err) {
        console.error(err);
        if (next) {
          next(err, null)
        }
      } else {
        console.log('After Create DB', data)
        if (next) {
          next(null, data)
        }
      }
    });
  },
  drop: function (DatabaseName, auth, next) {
    Database.dropDatabase(DatabaseName, auth, (err, data) => {
      if (err) {
        console.error(err);
        if (next) {
          next(err, null)
        }
      } else {
        console.log('After Create DB', data)
        if (next) {
          next(null, data)
        }
      }
    });
  }
}

let op = new Operations();
op.add('cenas', auth, () => {

});