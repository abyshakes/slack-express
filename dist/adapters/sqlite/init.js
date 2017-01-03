'use strict';

// creates a sqllite database for storing Slack accounts
//
// tablename
// -------------------
// user_id ... hash
// team_id ... range
//
var sqlite = require('sqlite3').verbose();
var db = new sqlite.Database('accounts.sqlite3');

db.run('create table if not exists user (user_id text, team_id text, access_token text)');