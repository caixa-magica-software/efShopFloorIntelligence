const async = require('async');
const express = require('express');
const router = express.Router();

function main(req, res) {
    async.waterfall([function getAllEventsByMachineId(cbk) {
        cbk(null, {
            machineId: req.query.machineId
        });
    },
    hasMachineId], function(err, result) {
        if (err) {
            res.status(500).send(err);
        } else {
            res.status(200).send(result || 1);
        }
    });
}
function hasMachineId(args, cbk) {
    if ((function(inputs) {
        return inputs.machineId == null;
    })(args)) {
        async.waterfall([function(cbkStart) {
            cbkStart(null, args);
        },
        queryAllRecords, normalizeData], function(err, result) {
            cbk(err, result);
        });
    } else if ((function(inputs) {
        return inputs.machineId != null;
    })(args)) {
        async.waterfall([function(cbkStart) {
            cbkStart(null, args);
        },
        queryRecordsById, normalizeData], function(err, result) {
            cbk(err, result);
        });
    }
}
function queryAllRecords(args, cbk) {
    const map = (function map(inputs) {
        return {
            authorization: 'Basic cG9zdGdyZXM6dmZvcw==',
            databaseName: 'efShopFloorIntelligence',
            tableName: 'productionEvent',
            order_by: ['timestamp ASC']
        };
    })(args);
    const requestOptions = {
        method: 'get',
        url: (function() {
            let url = 'http://reverse-proxy/vfrelstorage/vfos/rel/1.0.5/databases/' + encodeURI(map.databaseName) + '/tables/' + encodeURI(map.tableName) + '/rows';
            let separator = '?';
            if (map.query_columns_specification != null) {
                url += separator + 'query_columns_specification=' + encodeURI(map.query_columns_specification);
                separator = '&';
            }
            if (map.filter != null) {
                url += separator + 'filter=' + encodeURI(map.filter);
                separator = '&';
            }
            if (map.skip != null) {
                url += separator + 'skip=' + encodeURI(map.skip);
                separator = '&';
            }
            if (map.limit != null) {
                url += separator + 'limit=' + encodeURI(map.limit);
                separator = '&';
            }
            if (map.group_by != null) {
                url += separator + 'group_by=' + encodeURI(map.group_by);
                separator = '&';
            }
            if (map.having != null) {
                url += separator + 'having=' + encodeURI(map.having);
                separator = '&';
            }
            if (map.order_by != null) {
                url += separator + 'order_by=' + encodeURI(map.order_by);
                separator = '&';
            }
            return url;
        })(),
        headers: {
            'authorization': map.authorization,
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        }
    };
    console.log(requestOptions)
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
function queryRecordsById(args, cbk) {
    const map = (function map(inputs) {
        return {
            authorization: 'Basic cG9zdGdyZXM6dmZvcw==',
            databaseName: 'efShopFloorIntelligence',
            tableName: 'productionEvent',
            filter: 'machineId = \'' + inputs.machineId + '\'',
            order_by: ['timestamp ASC']
        };
    })(args);
    const requestOptions = {
        method: 'get',
        url: (function() {
            let url = 'http://reverse-proxy/vfrelstorage/vfos/rel/1.0.5/databases/' + encodeURI(map.databaseName) + '/tables/' + encodeURI(map.tableName) + '/rows';
            let separator = '?';
            if (map.query_columns_specification != null) {
                url += separator + 'query_columns_specification=' + encodeURI(map.query_columns_specification);
                separator = '&';
            }
            if (map.filter != null) {
                url += separator + 'filter=' + encodeURI(map.filter);
                separator = '&';
            }
            if (map.skip != null) {
                url += separator + 'skip=' + encodeURI(map.skip);
                separator = '&';
            }
            if (map.limit != null) {
                url += separator + 'limit=' + encodeURI(map.limit);
                separator = '&';
            }
            if (map.group_by != null) {
                url += separator + 'group_by=' + encodeURI(map.group_by);
                separator = '&';
            }
            if (map.having != null) {
                url += separator + 'having=' + encodeURI(map.having);
                separator = '&';
            }
            if (map.order_by != null) {
                url += separator + 'order_by=' + encodeURI(map.order_by);
                separator = '&';
            }
            return url;
        })(),
        headers: {
            'authorization': map.authorization,
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        }
    };
    console.log(requestOptions)
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
function normalizeData(args, cbk) {
    function script(inputs, next) {
        console.log(inputs)
        next(null, {
            machineId: inputs.machineId,
            productionEvents: inputs.list_of_rows.map(function(row) {
	           return {
	               timestamp: row.timestamp,
                   event: row.event,
                   batch: row.batch,
                   productId: row.productid,
                   productTypeCode: row.producttypecode
	           };	
           })
        })
    }
    script(args, cbk);
}
module.exports = function(app) {
    router.get('/getProductionEvents', main);
    return router;
}