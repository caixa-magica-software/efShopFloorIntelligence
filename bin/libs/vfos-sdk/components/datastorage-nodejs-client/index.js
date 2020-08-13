
var Db = require('./src/api/DatabasesApi')

// console.log('Log ', Db);




module.exports = {
    Database: require('./src/api/DatabasesApi'),
    Tables: require('./src/api/TablesApi.js'),
    Rows: require('./src/api/RowsApi'),
    Views: require('./src/api/ViewsApi'),
    Indexes: require('./src/api/IndexesApi')
}