'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.exists = exists;
exports.create = create;
exports.default = init;

var _awsSdk = require('aws-sdk');

var _awsSdk2 = _interopRequireDefault(_awsSdk);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var dynamo = new _awsSdk2.default.DynamoDB(); // creates a dynamodb instance for storing Slack accounts
//
// tablename
// -------------------
// user_id ... hash
// team_id ... range
//
function exists(table, callback) {
  dynamo.listTables(function (err, data) {
    if (err) {
      callback(err, false);
    } else {
      var found = false;
      data.TableNames.forEach(function (tbl) {
        if (table === tbl) found = true;
      });
      callback(null, found);
    }
  });
}

function create(table, callback) {
  var schema = {
    TableName: table,
    AttributeDefinitions: [{ AttributeName: 'team_id', AttributeType: 'S' }, { AttributeName: 'user_id', AttributeType: 'S' }],
    KeySchema: [{ AttributeName: 'team_id', KeyType: 'HASH' }, { AttributeName: 'user_id', KeyType: 'RANGE' }],
    GlobalSecondaryIndexes: [{
      IndexName: 'user_id_index',
      KeySchema: [{ AttributeName: 'user_id', KeyType: 'HASH' }],
      Projection: { ProjectionType: 'ALL' },
      ProvisionedThroughput: {
        ReadCapacityUnits: 1,
        WriteCapacityUnits: 1
      }
    }],
    ProvisionedThroughput: {
      ReadCapacityUnits: 1,
      WriteCapacityUnits: 1
    }
  };
  dynamo.createTable(schema, function (err, data) {
    if (err) {
      callback(err, err.stack);
    } else {
      callback(null, data);
    }
  });
}

function init() {
  var appname = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'slack-slash-app';
  var callback = arguments[1];

  exists(appname, function (err, found) {
    if (err) {
      callback(err, false);
    } else if (found) {
      callback(null, appname + ' exists');
    } else {
      create(appname, callback);
    }
  });
}

if (require.main === module) {
  init(process.env.DYNAMODB_TABLENAME || 'bugbot', function (err, success) {
    if (err) {
      console.error(err);
    } else {
      console.log(success);
    }
  });
}