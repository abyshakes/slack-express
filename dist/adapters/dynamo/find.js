'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _awsSdk = require('aws-sdk');

var _awsSdk2 = _interopRequireDefault(_awsSdk);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var dynamo = new _awsSdk2.default.DynamoDB();

function clean(obj) {
  var keys = Object.keys(obj);
  var result = {};
  keys.forEach(function (k) {
    result[k] = obj[k].S || obj[k].BOOL;
  });
  return result;
}

function find(params, callback) {
  if (!params.user_id || !params.team_id) {
    callback(Error('user_id or team_id missing'));
  } else {
    // query for the account in dynamo
    var query = {
      TableName: process.env.DYNAMODB_TABLENAME || 'bugbot',
      Key: {
        user_id: { S: params.user_id },
        team_id: { S: params.team_id }
      }
    };
    dynamo.getItem(query, function (err, data) {
      if (err) {
        callback(err);
      } else {
        var account = data.Item ? clean(data.Item) : null;
        callback(null, account);
      }
    });
  }
}

exports.default = find;
module.exports = exports['default'];