import mysql from 'mysql';

let connection = mysql.createConnection({
  host: process.env.MYSQL_HOST,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DB
});

function clean(obj) {
  let keys = Object.keys(obj)
  let result = {}
  keys.forEach(k=> {
    result[k] = obj[k].S || obj[k].BOOL
  })
  return result
}

function find(params, callback) {
  if (!params.user_id || !params.team_id) {
    callback(Error('user_id or team_id missing'))
  }
  else {
    // query for the account in dynamo
    query = `SELECT * FROM ${process.env.MYSQL_TABLE} WHERE user_id = ${params.user_id} AND team_id = ${params.team_id} LIMIT 1`;
    connection.query(query, (err, rows, fields) => {
      if (err) {
        callback(err);
      }
      else {
        let account.user_id = rows[0].user_id;
        let account.team_id = rows[0].team_id;
        let account.access_token = rows[0].access_token;
        callback(null, account);
      }
    });
  }
}

export default find
