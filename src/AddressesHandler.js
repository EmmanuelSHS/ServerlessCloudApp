'use strict';

console.log('Loading function');

const doc = require('dynamodb-doc');

const dynamo = new doc.DynamoDB();

exports.handler = (event, context, callback) => {
    console.log('Received event:', JSON.stringify(event, null, 2));
    
    switch (event.operation) {
        case 'create':
            createAddress(event.id, event.address, done, callback);
            break;
        case 'read':
            readAddress(event.id, done, callback);
            break;
        case 'update':
            updateAddress(event.id, event.address, done, callback);
            break;
        case 'delete':
            deleteAddress(event.id, done, callback);
            break;
        default:
            done(new Error(`Unsupported method "${event.operation}"`), null, callback);
    }
};

function done(err, data, callback) {
    if (err) {
        var errObj = {
            message: err.message,
            httpStatus: makeHttpStatus(err.message)
        };
        callback(JSON.stringify(errObj), null);
        console.log('Error:', JSON.stringify(err));
    } else {
        callback(null, data);
        console.log('Data:', JSON.stringify(data));
    }
}

function makeHttpStatus(message) {
    if (message.startsWith('Unsupported method')) {
        return 405;
    } else if (message.startsWith('Nonexistent address id')) {
        return 404;
    } else {
        return 400;
    }
}

function createAddress(id, address, preCallback, callback) {
    var item = {
        city: address.city,
        street: address.street,
        streetNumber: address.streetNumber,
        zipCode: address.zipCode
    };
    if (validateAddress(item) < 0) {
        preCallback(new Error('Incorrect address'), null, callback);
    }
    createItem(id, item, preCallback, callback);
}

function createItem(key, item, preCallback, callback) {
    var new_item = {id: key};
    for (var attr in item) {
        if (item[attr]) {
            new_item[attr] = item[attr];
        }
    }
    var params = {
        TableName: 'addresses',
        ConditionExpression: 'attribute_not_exists(id)',
        Item: new_item
    };
    dynamo.putItem(params, function(err, data) {
        if (err && err.code == 'ConditionalCheckFailedException') {
            preCallback(new Error(`Existent address id ${key}`), null, callback);
        } else {
            new_item['self'] = {"href":"/addresses/"+ new_item.id}
            preCallback(err, new_item, callback); 
        }
    });
}

function readAddress(id, preCallback, callback) {
    readItem(id, preCallback, callback);
}

function readItem(key, preCallback, callback) {
    var params = {
        TableName: 'addresses',
        Key: { id: key }
    };
    dynamo.getItem(params, function(err, data) {
        if (Object.keys(data).length === 0) {
            preCallback(new Error(`Nonexistent address id ${key}`), null, callback);
        } else {
            var item = data.Item;
            item["self"] = {"href":"/addresses/"+ item.id}
            preCallback(err, item, callback);
        }
    });
}

function updateAddress(id, address, preCallback, callback) {
    var item = {
        city: address.city,
        street: address.street,
        streetNumber: address.streetNumber,
        zipCode: address.zipCode
    };
    if (validateAddress(address)) {
        preCallback(new Error('Incorrect address'), null, callback);
    }
    updateItem(id, item, preCallback, callback)
}

function updateItem(key, item, preCallback, callback) {
    var updateExpression = []; 
    var expressionAttributeValues = {};
    for (var attr in item) {
        if (item[attr]) {
            var name = ':' + attr;
            updateExpression.push(attr + ' = ' + name);
            expressionAttributeValues[name] = item[attr];
        }
    }
    updateExpression = 'SET ' + updateExpression.join(', ');
    var params = {
        TableName: 'addresses',
        ConditionExpression: 'attribute_exists(id)',
        Key: {
            id: key
        },
        UpdateExpression: updateExpression,
        ExpressionAttributeValues: expressionAttributeValues,
        ReturnValues: 'ALL_NEW'
        
    };
    dynamo.updateItem(params, function (err, data) {
        if (err && err.code == 'ConditionalCheckFailedException') {
            preCallback(new Error(`Nonexistent address id ${key}`), null, callback);
        } else {
            var item = data.Attributes
            item["self"] = {"href":"/addresses/"+ item.id}
            preCallback(err, item, callback); 
        }
    });
}

function deleteAddress(id, preCallback, callback) {
    deleteItem(id, preCallback, callback);
}

function deleteItem(key, preCallback, callback) {
    var dynamoParams = {
        TableName: 'addresses',
        ConditionExpression: 'attribute_exists(id)',
        Key: { id: key },
        ReturnValues: 'ALL_OLD'
    };
    dynamo.deleteItem(dynamoParams, function (err, data) {
        if (err && err.code == 'ConditionalCheckFailedException') {
            preCallback(new Error(`Nonexistent address id ${key}`), null, callback);
        } else {
            preCallback(err, data.Attributes, callback); 
        }
    });
}

function validateAddress(address, errorHandler) {
    if (address.city && !/^[a-zA-Z ]+$/.test(address.city)) {
        return -1;
    }
    if (address.street && !/^[a-zA-Z0-9 ]+$/.test(address.street)) {
        return -1;
    }
    if (address.streetNumber && !/^\d+$/.test(address.streetNumber)) {
        return -1;
    }
    if (address.zipCode && !/^\d{5}$/.test(address.zipCode)) {
        return -1;
    }
    return 0;
}