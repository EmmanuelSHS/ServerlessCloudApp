'use strict';

console.log('Loading function');

const doc = require('dynamodb-doc');

const dynamo = new doc.DynamoDB();

exports.handler = (event, context, callback) => {
    console.log('Received event:', JSON.stringify(event, null, 2));
    
    switch (event.operation) {
        case 'create':
            createCustomer(event.email, event.info, done, callback);
            break;
        case 'read':
            readCustomer(event.email, done, callback);
            break;
        case 'update':
            updateCustomer(event.email, event.info, done, callback);
            break;

        case 'delete':
            deleteCustomer(event.email, done, callback);
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
    } else if (message.startsWith('Nonexistent email')) {
        return 404;
    } else {
        return 400;
    }
}

function createCustomer(email, info, preCallback, callback) {
    var item = {
        email: email,
        lastName: info.lastName,
        firstName: info.firstName,
        phoneNumber: info.phoneNumber,
        address: info.address
    };
    var err = checkValid(item)
    if (err) {
        preCallback(new Error(err), null, callback);
        return
    }
    createItem(email, info, preCallback, callback);
}

function createItem(key, item, preCallback, callback) {
    var new_item = {email: key};
    for (var attr in item) {
        if (item[attr]) {
            new_item[attr] = item[attr];
        }
    }
    var params = {
        TableName: 'customers',
        ConditionExpression: 'attribute_not_exists(email)',
        Item: new_item
    };
    dynamo.putItem(params, function(err, data) {
        if (err && err.code == 'ConditionalCheckFailedException') {
            preCallback(new Error(`Existent email ${key}`), null, callback);
        } else {
            new_item.address = {"href": new_item.address}
            new_item['self'] = {"href":"/customers/"+ new_item.email}
            
            preCallback(err, new_item, callback); 
        }
    });
}

function readCustomer(email, preCallback, callback) {
    readItem(email, preCallback, callback);
}

function readItem(key, preCallback, callback) {
    var params = {
        TableName: 'customers',
        Key: { email: key }
    };
    dynamo.getItem(params, function(err, data) {
        if (Object.keys(data).length === 0) {
            preCallback(new Error(`Nonexistent email ${key}`), null, callback);
        } else {
            var item = data.Item;
            item.address = {"href": item.address}
            item["self"] = {"href":"/customers/"+ item.email}
            preCallback(err, item, callback);
        }
    });
}

function updateCustomer(email, info, preCallback, callback) {
    var item = {
        email: email,
        lastName: info.lastName,
        firstName: info.firstName,
        phoneNumber: info.phoneNumber,
        address: info.address
    };
    var err = checkValid(item)
    if (err) {
        preCallback(new Error(err), null, callback);
        return
    }
    updateItem(email, info, preCallback, callback)
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
        TableName: 'customers',
        ConditionExpression: 'attribute_exists(email)',
        Key: {
            email: key
        },
        UpdateExpression: updateExpression,
        ExpressionAttributeValues: expressionAttributeValues,
        ReturnValues: 'ALL_NEW'
        
    };
    dynamo.updateItem(params, function (err, data) {
        if (err && err.code == 'ConditionalCheckFailedException') {
            preCallback(new Error(`Nonexistent email${key}`), null, callback);
        } else {
            var item = data.Attributes
            item.address = {"href": item.address}
            item["self"] = {"href":"/customers/"+ item.email}
            preCallback(err, item, callback); 
        }
    });
}

function deleteCustomer(email, preCallback, callback) {
    deleteItem(email, preCallback, callback);
}

function deleteItem(key, preCallback, callback) {
    var dynamoParams = {
        TableName: 'customers',
        ConditionExpression: 'attribute_exists(email)',
        Key: { email: key },
        ReturnValues: 'ALL_OLD'
    };
    dynamo.deleteItem(dynamoParams, function (err, data) {
        if (err && err.code == 'ConditionalCheckFailedException') {
            preCallback(new Error(`Nonexistent email ${key}`), null, callback);
        } else {
            var item = data.Attributes
            item.address = {"href": item.address}
            preCallback(err, item, callback); 
        }
    });
}

function checkValid(item) {
    var ans = [];
    if ("email" in item) {
        console.log("check email");
        if (!item.email){
            ans.push('Missing field: email')
        }
        else{
            if (item.email.indexOf('@') <= 0) {
                ans.push('Invalid email');
            }
        }
    }
    
    if ("phoneNumber" in item) {
        console.log("check phone number");
        if (!item.phoneNumber){
            ans.push('Missing field: phoneNumber')
        }
        else{
            var i = 0;
            for (i = 0; i < item.phoneNumber.length; ++i) {
                if (item.phoneNumber[i] > '9' || item.phoneNumber[i] < '0') {
                    ans.push("Invalid phone number");
                    break;
                }
            }
        }
    }

    if ("lastName" in item) {
        console.log("check lastName");
        console.log(item.lastName)
        if (!item.lastName){
            ans.push('Missing field: lastName')
        }
        else{
            if (!/^[a-zA-Z ]+$/.test(item.lastName)) {
                ans.push('Invalid lastName');
            }
        }
    }
    
    if ("firstName" in item) {
        console.log("check firstName");
        if (!item.firstName){
            ans.push('Missing field: firstName')
        }
        else{
            if (!/^[a-zA-Z ]+$/.test(item.firstName)) {
                ans.push('Invalid firstName');
            }
        }
    }
    
    if ("address" in item){
        console.log("check address");
        if (!item.address){
            ans.push('Missing field: address')
        }
    }

    
    return ans.join(", ");
}


