'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _awsSdk = require('aws-sdk');

var _awsSdk2 = _interopRequireDefault(_awsSdk);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var dynamo = new _awsSdk2.default.DynamoDB();

// blind write to team_id|user_id key
// {url, team, user, team_id, user_id}
function save(params, callback) {
  if (!params.team_id) {
    callback(Error('missing team_id'));
  } else if (!params.user_id) {
    callback(Error('missing user_id'));
  } else {
    (function () {
      var TableName = process.env.DYNAMODB_TABLENAME || 'bugbot';
      var Item = {};
      var query = { TableName: TableName, Item: Item };
      Object.keys(params).forEach(function (k) {
        if (typeof params[k] === 'boolean') {
          query.Item[k] = { BOOL: params[k] };
        } else {
          query.Item[k] = { S: params[k] };
        }
      });
      dynamo.putItem(query, function (err, result) {
        if (err) {
          callback(err);
        } else {
          callback(null, params);
        }
      });
    })();
  }
}

exports.default = save;
module.exports = exports['default'];