let sqlite = require('sqlite3').verbose();
let db = new sqlite.Database('data.sqlite3');

export default function save(params, callback){
  let insertQuery = `INSERT INTO ${process.env.MYSQL_TABLE} SET user_id = ${params.user_id}, team_id = ${params.team_id}, access_token = ${params.access_token}`;
  db.run(insertQuery);
}
