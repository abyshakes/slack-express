'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = find;
var sqlite = require('sqlite3').verbose();
var db = new sqlite.Database('data.sqlite3');

function find(params, callback) {
  var query = 'SELECT * FROM ' + process.env.MYSQL_TABLE + ' WHERE user_id = ' + params.user_id + ' AND team_id = ' + params.team_id + ' LIMIT 1';

  db.all(query, function (err, rows) {
    if (err) {
      callback(err);
    } else {
      var account = rows[0];
      callback(null, account);
    }
  });
}
module.exports = exports['default'];