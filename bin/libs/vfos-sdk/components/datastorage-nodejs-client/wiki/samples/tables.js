/**
 * 
 * Samples and testing tables operation in datastorage
 * 
 */

let tables = require('../../src/api/TablesApi');

let auth = 'Basic cG9zdGdyZXM6dmZvcw=='


let Operations = function () {

}

Operations.prototype = {

  listTables: function (auth, table, next) {
    tables.listTables(table, auth, (err, data) => {
      if (err) {
        console.log('Error its ', err)
        if (next) {
          next(err, null)
        }
      } else {
        console.log('Data ', data)
        if (next) {
          next(null, data)
        }
      }
    });
  },
  addTable: function (auth, dbName, tableDef, next) {
    tables.addTable(dbName, tableDef, auth, (err, data) => {
      if (err) {
        console.error(err)
        next(err, null)
      } else {
        //console.log(data)
        next(null, data)
      }

    });
  }
}



// tables.describeTable('benfica', 'cars',  auth, (err, data) => {
//     if(err){
//         console.log('Error its ', err)
//     }else{
//         console.log('Data ', data)
//     }
// });