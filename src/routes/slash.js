import {cmds} from '../'
import request from 'request'
import find from '../methods/find'

let client_id = process.env.SLACK_CLIENT_ID
let client_secret = process.env.SLACK_CLIENT_SECRET

function parseSlackMessage(msg, callback) {
  let stack = cmds()                                // all the commands
  let sub  = msg.text? msg.text.split(' ')[0] : ''  // sub command (foo from '/bb foo')
  let cmd  = `${msg.command} ${sub}`.trim()         // full command ('/bb foo')
  let ids  = Object.keys(stack)                     // all the command ids
  let it   = ids.filter(id=> id.indexOf(cmd) > -1)  // array of matches
  let id   = it.length === 0? ids[0] : it[0]        // THE id or the first one
  // slash command middleware wut
  let middleware = stack[id].reverse()
  // cleanup the payload signature: {raw, message, account}
  let payload = {
    ok: true,
    raw: msg,
    account: {},
    message: {
      token: msg.token,
      response_url: msg.response_url,
      channel_id: msg.channel_id,
      channel_name: msg.channel_name,
      command: msg.command,
      text: msg.text
    }
  }
  // lookup the account in the db
  find(payload.raw, (err, account)=> {

    if (err) {
      payload.ok = false
      payload.text = 'find method returned an error'
    }
    else if (!account) {
      payload.ok = true
      payload.text = 'no account saved for this slack user'
    }
    else {
      payload.ok = true
      payload.text = 'account found'
      payload.account = account
    }
    // end of find
    callback(err, {payload, middleware})
  })
}

// recives a slash command
export default function slash(req, res, next) {

  // parse out the payload and middleware for the Slack /command POST
  parseSlackMessage(req.body, (err, data)=> {

    // payload is passed to each middleware fn
    // each middleware fn is executed in serial by callee executing next()
    let {payload, middleware} = data

    // sends response to the Slack POST
    function message(msg) {
      // override the response message to appear in channel it was requested from
      msg.channel = payload.message.channel_id
      // use the reponse_url property to get over 3s window to respond 
      let url     = payload.message.response_url
      let headers = {'Content-Type':'application/json'}
      let body    = JSON.stringify(msg)
      request.post({url, headers, body}, err=> {
        if (err) {
          res.json({text:err})
        }
        else {
          res.status(200).end()
        }
      })
    }

    // named iife for the first middleware fn
    ;(function iterator(i) {
      // grab the next middleware fn to exec
      let next = iterator.bind(null, i + 1)
      // exec the current middleware with args
      middleware[i].call({}, payload, message, next)
    })(0)
  })
}
