/**
 * 
 * Samples and testing tables operation in datastorage
 * 
 */

let Rows = require('../../src/api/RowsApi');

let auth = 'Basic cG9zdGdyZXM6dmZvcw=='


let Operations = function () {

}

Operations.prototype = {

  addRow: function (auth, dbName, tableName, rowDef, next) {
    Rows.insertRows(dbName, tableName, rowDef, auth, (err, data) => {

      if (err) {
        console.error("error insert new line ", err);
        next(err, null)
      } else {
        console.log('Line inseted with sucess')
        next(null, data)
      }

    });
  },
  removeRow: function (auth, dbName, tableDef, next) {
    Rows.removeRows(dbName, tableName, rowDef, auth, (err, data) => {

      if (err) {
        console.error("error insert new line ", err);
        next(err, null)
      } else {
        console.log('Line inseted with sucess')
        next(null, data)
      }

    });
  }
}