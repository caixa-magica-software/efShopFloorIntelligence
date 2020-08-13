


let tables = require('./src/api/TablesApi')


let auth = 'Basic cG9zdGdyZXM6dmZvcw=='

tables.listTables('benfica', auth, (err, data) => {
    if(err){
        console.log('Error its ', err)
    }else{
        console.log('Data ', data)
    }
});

tables.describeTable('benfica', 'cars',  auth, (err, data) => {
    if(err){
        console.log('Error its ', err)
    }else{
        console.log('Data ', data)
    }
});