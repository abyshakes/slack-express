'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = save;
var sqlite = require('sqlite3').verbose();
var db = new sqlite.Database('data.sqlite3');

function save(params, callback) {
  var insertQuery = 'INSERT INTO ' + process.env.MYSQL_TABLE + ' SET user_id = ' + params.user_id + ', team_id = ' + params.team_id + ', access_token = ' + params.access_token;
  db.run(insertQuery);
}
module.exports = exports['default'];