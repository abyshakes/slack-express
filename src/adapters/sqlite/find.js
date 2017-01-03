let sqlite = require('sqlite3').verbose();
let db = new sqlite.Database('data.sqlite3');

export default function find(params, callback) {
  let query = `SELECT * FROM ${process.env.MYSQL_TABLE} WHERE user_id = ${params.user_id} AND team_id = ${params.team_id} LIMIT 1`;

  db.all(query, (err, rows) => {
      if (err) {
        callback(err);
      }
      else {
        let account = rows[0];
        callback(null, account);
      }
  });
}
