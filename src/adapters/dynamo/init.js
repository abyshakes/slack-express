// creates a dynamodb instance for storing Slack accounts
//
// tablename
// -------------------
// user_id ... hash
// team_id ... range
//
import aws from 'aws-sdk'

let dynamo = new aws.DynamoDB()

export function exists(table, callback) {
  dynamo.listTables(function(err, data) {
    if (err) {
      callback(err, false)
    }
    else {
      let found = false
      data.TableNames.forEach((tbl)=> {
        if (table === tbl) found = true
      })
      callback(null, found)
    }
  })
}

export function create(table, callback) {
  let schema = {
    TableName: table,
    AttributeDefinitions: [
      {AttributeName: 'team_id', AttributeType: 'S'},
      {AttributeName: 'user_id', AttributeType: 'S'}
    ],
    KeySchema: [
      {AttributeName: 'team_id', KeyType: 'HASH'},
      {AttributeName: 'user_id', KeyType: 'RANGE'}
    ],
    GlobalSecondaryIndexes: [{
      IndexName: 'user_id_index',
      KeySchema: [{AttributeName: 'user_id', KeyType: 'HASH'}],
      Projection: {ProjectionType: 'ALL'},
      ProvisionedThroughput: {
        ReadCapacityUnits:1,
        WriteCapacityUnits: 1
      }
    }],
    ProvisionedThroughput: {
      ReadCapacityUnits:1,
      WriteCapacityUnits: 1
    }
  }
  dynamo.createTable(schema, (err, data)=> {
    if (err) {
      callback(err, err.stack)
    }
    else {
      callback(null, data)
    }
  })
}

export default function init(appname='slack-slash-app', callback) {
  exists(appname, (err, found)=> {
    if (err) {
      callback(err, false)
    }
    else if (found) {
      callback(null, `${appname} exists`)
    }
    else {
      create(appname, callback)
    }
  })
}

if (require.main === module) {
  init(process.env.DYNAMODB_TABLENAME || 'bugbot', (err, success)=> {
    if (err) {
      console.error(err)
    }
    else {
      console.log(success)
    }
  })
}
