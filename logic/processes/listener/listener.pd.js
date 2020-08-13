const async = require('async');
const express = require('express');
const sdk = require('../../../bin/libs/vfos-sdk/sdk-include');
const moment = require('moment')

const router = express.Router();

function main() {
    async.waterfall([function listener(cbk) {
        cbk(null, {});
    },
    receiveEvents], function(err, result) {
        if (err) {
            console.log(err);
        }
    });
}
function receiveEvents(args, cbk) {
    console.log('receiveEvents')
    const pubsub = new sdk.messaging(sdk.config.MESSAGING_PUBSUB.SERVER_URL, 'events', '', ['eu.efactory.wp5.review.events']);
    pubsub.registerPublicationReceiver(function(msg) {
        try {
            args.message = JSON.parse(msg.content.toString());
            console.log('Recebi');
            console.log(args.message);
            async.waterfall([function(cbkStart) {
                cbkStart(null, args);
            },
            normalizeData, persistEvent, isStop], function(err, result) {
                if (err) {
                    console.log(err);
                };
            });
        } catch (err) {
            console.log(err);
        }
    });
}
function normalizeData(args, cbk) {
    function script(inputs, next) {
        var data = inputs.message;
        next(null, {
            event: {
                timestamp: data.timestamp,
                machineId: data.machineId,
                event: data.productionEvent.event,
                batch: data.productionEvent.batch,
                productId: data.productionEvent.productId,
                productTypeCode: data.productionEvent.productTypeCode
            }
        });
    }
    script(args, cbk);
}
function persistEvent(args, cbk) {
    const map = (function map(inputs) {
        return {
            authorization: 'Basic cG9zdGdyZXM6dmZvcw==',
            databaseName: 'efShopFloorIntelligence',
            tableName: 'productionEvent',
            body: [inputs.event]
        };
    })(args);
    const requestOptions = {
        method: 'post',
        url: (function() {
            let url = 'http://reverse-proxy/vfrelstorage/vfos/rel/1.0.5/databases/' + encodeURI(map.databaseName) + '/tables/' + encodeURI(map.tableName) + '/rows';
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
function isStop(args, cbk) {
    if ((function(inputs) {
        return inputs.event.event === "stop";
    })(args)) {
        async.waterfall([function(cbkStart) {
            args = { sortBy: 'start', ...args }
            cbkStart(null, args);
        },
        queryRecordsStart, updateStop], function(err, result) {
            cbk(err, result);
        });
    } else if ((function(inputs) {
        return inputs.event.event === "start";
    })(args)) {
        async.waterfall([function(cbkStart) {
            cbkStart(null, args);
        },
        normalizeHistoryData, persistHistory, queryRecordsStop, hasPreviousStart], function(err, result) {
            cbk(err, result);
        });
    }
}
function queryRecordsStart(args, cbk) {
    const map = (function map(inputs) {
        return {
            authorization: 'Basic cG9zdGdyZXM6dmZvcw==',
            databaseName: 'efShopFloorIntelligence',
            tableName: 'historyEvent',
            filter: 'machineId = \'' + inputs.event.machineId + '\'',
            order_by: ['start DESC'],
            limit: 1
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
    require('request')(requestOptions, function(err, response) {
        let responseBody = response ? JSON.parse(response.body || '') : '';
        if (!err && (200 <= response.statusCode) && (response.statusCode < 300)) {
            console.log('responseBody')
            console.log(responseBody)
            cbk(null, {...args, ...responseBody
            });
        } else {
            cbk(err || responseBody || 'error');
        }
    });
}
function updateStop(args, cbk) {
    console.log('updateStop')
    console.log(args)
    const format = 'YYYY-MM-DD HH:mm:ss';
    const map = (function map(inputs) {
        return {
            authorization: 'Basic cG9zdGdyZXM6dmZvcw==',
            databaseName: 'efShopFloorIntelligence',
            tableName: 'historyEvent',
            body: {
                stop: inputs.event.timestamp,
                changeover: moment.utc(moment(inputs.event.timestamp, format).diff(moment(inputs.list_of_rows[0].start,format))).format("HH:mm:ss") 
                
            },
            filter: 'machineId = \'' + inputs.event.machineId + '\' AND start = \'' + inputs.list_of_rows[0].start + '\'',
        };
    })(args);
    const requestOptions = {
        method: 'patch',
        url: (function() {
            let url = 'http://reverse-proxy/vfrelstorage/vfos/rel/1.0.5/databases/' + encodeURI(map.databaseName) + '/tables/' + encodeURI(map.tableName) + '/rows';
            let separator = '?';
            if (map.filter != null) {
                url += separator + 'filter=' + encodeURI(map.filter);
                separator = '&';
            }
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
function normalizeHistoryData(args, cbk) {
    function script(inputs, next) {
        next(null, {
            event: {
                machineId: inputs.event.machineId,
                start: inputs.event.timestamp,
                previous: inputs.event.productTypeCode,
                productId: inputs.event.productId
            }
        });
    }
    script(args, cbk);
}
function persistHistory(args, cbk) {
        console.log('persistHistory')
    console.log(args)
    const map = (function map(inputs) {
        return {
            authorization: 'Basic cG9zdGdyZXM6dmZvcw==',
            databaseName: 'efShopFloorIntelligence',
            tableName: 'historyEvent',
            body: [inputs.event]
        };
    })(args);
    const requestOptions = {
        method: 'post',
        url: (function() {
            let url = 'http://reverse-proxy/vfrelstorage/vfos/rel/1.0.5/databases/' + encodeURI(map.databaseName) + '/tables/' + encodeURI(map.tableName) + '/rows';
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
function queryRecordsStop(args, cbk) {
    console.log('queryRecordsStop')
    const map = (function map(inputs) {
        return {
            authorization: 'Basic cG9zdGdyZXM6dmZvcw==',
            databaseName: 'efShopFloorIntelligence',
            tableName: 'historyEvent',
            filter: 'machineId = \'' + inputs.event.machineId + '\' AND stop IS NOT NULL',
            order_by: ['stop DESC'],
            limit: 1
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
    require('request')(requestOptions, function(err, response) {
        let responseBody = response ? JSON.parse(response.body || '') : '';
        if (!err && (200 <= response.statusCode) && (response.statusCode < 300)) {
            console.log('responseBody')
            console.log(responseBody)
            cbk(null, {...args, ...responseBody
            });
        } else {
            cbk(err || responseBody || 'error');
        }
    });
}
function hasPreviousStart(args, cbk) {
    if ((function(inputs) {
        return inputs.list_of_rows.length > 0;
    })(args)) {
        async.waterfall([function(cbkStart) {
            cbkStart(null, args);
        },
        updateStart], function(err, result) {
            cbk(err, result);
        });
    }
}
function updateStart(args, cbk) {
    console.log('updateStart')
    console.log(args)
    const map = (function map(inputs) {
        return {
            authorization: 'Basic cG9zdGdyZXM6dmZvcw==',
            databaseName: 'efShopFloorIntelligence',
            tableName: 'historyEvent',
            body: {
                next: inputs.event.previous
            },
            filter: 'machineId = \'' + inputs.event.machineId + '\' AND stop = \'' + inputs.list_of_rows[0].stop + '\'',
        };
    })(args);
    const requestOptions = {
        method: 'patch',
        url: (function() {
            let url = 'http://reverse-proxy/vfrelstorage/vfos/rel/1.0.5/databases/' + encodeURI(map.databaseName) + '/tables/' + encodeURI(map.tableName) + '/rows';
            let separator = '?';
            if (map.filter != null) {
                url += separator + 'filter=' + encodeURI(map.filter);
                separator = '&';
            }
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
            console.log('after update')
            console.log(responseBody)
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