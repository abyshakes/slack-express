import mysql from 'mysql';

let connection = mysql.createConnection({
  host: process.env.MYSQL_HOST,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DB
});

// blind write to team_id|user_id key
// {url, team, user, team_id, user_id}
function save(params, callback) {
  if (!params.team_id) {
    callback(Error('missing team_id'))
  }
  else if (!params.user_id) {
    callback(Error('missing user_id'))
  }
  else {
    let insertQuery = `INSERT INTO ${process.env.MYSQL_TABLE} SET user_id = ${params.user_id}, team_id = ${params.team_id}, access_token = ${params.access_token}`;
    connection.query(insertQuery, (err, rows, fields) => {
      if (err) {
        callback(err);
      }
      else {
        callback(null, params);
      }
    });
  }
}

export default save
