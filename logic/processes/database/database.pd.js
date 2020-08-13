const async = require('async');
const express = require('express');
const sdk = require('../../../bin/libs/vfos-sdk/sdk-include');
const router = express.Router();

function main() {
    async.waterfall([function database(cbk) {
        cbk(null, {});
    },
    databaseCreator, eventsTableCreator, historyTableCreator, historyViewCreator], function(err, result) {
        if (err) {
            console.log(err);
        }
    });
}
function databaseCreator(args, cbk) {
    const map = (function map(inputs) {
        return {
            authorization: 'Basic cG9zdGdyZXM6dmZvcw==',
            body: {
                database_name: 'efShopFloorIntelligence'
            }
        };
    })(args);
    const requestOptions = {
        method: 'post',
        url: (function() {
            return 'http://reverse-proxy/vfrelstorage/vfos/rel/1.0.5/databases';
        })(),
        headers: {
            'authorization': map.authorization,
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(map.body)
    };
    require('request')(requestOptions, function(err, response) {
        let responseBody = response ? JSON.parse(response.body || '') : '';
        if (!err && (200 <= response.statusCode) && (response.statusCode < 300)) {
            cbk(null, {...args, ...responseBody
            });
        } else {
            cbk(err || responseBody || 'error');
        }
    });
}
function eventsTableCreator(args, cbk) {
    const map = (function map(inputs) {
        return {
            authorization: 'Basic cG9zdGdyZXM6dmZvcw==',
            databaseName: 'efShopFloorIntelligence',
            body: {
                table_name: 'productionEvent',
                columns: [{
                    name: 'id',
                    type: 'serial'
                }, {
                    name: 'timestamp',
                    type: 'timestamp'
                }, {
                    name: 'machineId',
                    type: 'varchar'
                }, {
                    name: 'event',
                    type: 'varchar'
                }, {
                    name: 'batch',
                    type: 'int'
                }, {
                    name: 'productId',
                    type: 'varchar'
                }, {
                    name: 'productTypeCode',
                    type: 'varchar'
                }],
                constraints: []
            }
        };
    })(args);
    const requestOptions = {
        method: 'post',
        url: (function() {
            let url = 'http://reverse-proxy/vfrelstorage/vfos/rel/1.0.5/databases/' + encodeURI(map.databaseName) + '/tables';
            return url;
        })(),
        headers: {
            'authorization': map.authorization,
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(map.body)
    };
    require('request')(requestOptions, function(err, response) {
        let responseBody = response ? JSON.parse(response.body || '') : '';
        if (!err && (200 <= response.statusCode) && (response.statusCode < 300)) {
            cbk(null, {...args, ...responseBody
            });
        } else {
            cbk(err || responseBody || 'error');
        }
    });
}
function historyTableCreator(args, cbk) {
    const map = (function map(inputs) {
        return {
            authorization: 'Basic cG9zdGdyZXM6dmZvcw==',
            databaseName: 'efShopFloorIntelligence',
            body: {
                table_name: 'historyEvent',
                columns: [{
                    name: 'id',
                    type: 'serial'
                }, {
                    name: 'machineId',
                    type: 'varchar'
                }, {
                    name: 'start',
                    type: 'timestamp'
                }, {
                    name: 'stop',
                    type: 'timestamp'
                }, {
                    name: 'changeover',
                    type: 'varchar'
                }, {
                    name: 'previous',
                    type: 'varchar'
                }, {
                    name: 'next',
                    type: 'varchar'
                }, {
                    name: 'productId',
                    type: 'varchar'
                }],
                constraints: []
            }
        };
    })(args);
    const requestOptions = {
        method: 'post',
        url: (function() {
            let url = 'http://reverse-proxy/vfrelstorage/vfos/rel/1.0.5/databases/' + encodeURI(map.databaseName) + '/tables';
            return url;
        })(),
        headers: {
            'authorization': map.authorization,
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(map.body)
    };
    require('request')(requestOptions, function(err, response) {
        let responseBody = response ? JSON.parse(response.body || '') : '';
        if (!err && (200 <= response.statusCode) && (response.statusCode < 300)) {
            cbk(null, {...args, ...responseBody
            });
        } else {
            cbk(err || responseBody || 'error');
        }
    });
}
function historyViewCreator(args, cbk) {
    const map = (function map(inputs) {
        return {
            authorization: 'Basic cG9zdGdyZXM6dmZvcw==',
            databaseName: 'efShopFloorIntelligence',
            body: {
              "view_columns": [
                "machineid",
                "hash",
                "avg",
                "max",
                "min"
              ],
              "view_definition_query": "select machineid, (machineid || ';' ||previous || ';' || next) as hash, AVG(changeover::time), MAX(changeover::time), MIN(changeover::time) from efShopFloorIntelligence.historyevent where previous is not null and next is not null group by machineid, hash",
              "view_name": "statistics"
            }
        };
    })(args);
    const requestOptions = {
        method: 'post',
        url: (function() {
            let url = 'http://reverse-proxy/vfrelstorage/vfos/rel/1.0.5/databases/' + encodeURI(map.databaseName) + '/views';
            return url;
        })(),
        headers: {
            'authorization': map.authorization,
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(map.body)
    };
    require('request')(requestOptions, function(err, response) {
        let responseBody = response ? JSON.parse(response.body || '') : '';
        if (!err && (200 <= response.statusCode) && (response.statusCode < 300)) {
            cbk(null, {...args, ...responseBody
            });
        } else {
            cbk(err || responseBody || 'error');
        }
    });
}
module.exports = function(app) {
    try {
        main();
    } catch (err) {
        console.log(err);
    }
    return router;
}