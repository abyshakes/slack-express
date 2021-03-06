'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = slash;

var _ = require('../');

var _request = require('request');

var _request2 = _interopRequireDefault(_request);

var _find = require('../methods/find');

var _find2 = _interopRequireDefault(_find);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var client_id = process.env.SLACK_CLIENT_ID;
var client_secret = process.env.SLACK_CLIENT_SECRET;

function parseSlackMessage(msg, callback) {
  var stack = (0, _.cmds)(); // all the commands
  var sub = msg.text ? msg.text.split(' ')[0] : ''; // sub command (foo from '/bb foo')
  var cmd = (msg.command + ' ' + sub).trim(); // full command ('/bb foo')
  var ids = Object.keys(stack); // all the command ids
  var it = ids.filter(function (id) {
    return id.indexOf(cmd) > -1;
  }); // array of matches
  var id = it.length === 0 ? ids[0] : it[0]; // THE id or the first one
  // slash command middleware wut
  var middleware = stack[id];
  // cleanup the payload signature: {raw, message, account}
  var payload = {
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
  };
  // lookup the account in the db
  (0, _find2.default)(payload.raw, function (err, account) {

    if (err) {
      payload.ok = false;
      payload.text = 'find method returned an error';
    } else if (!account) {
      payload.ok = true;
      payload.text = 'no account saved for this slack user';
    } else {
      payload.ok = true;
      payload.text = 'account found';
      payload.account = account;
    }
    // end of find
    callback(err, { payload: payload, middleware: middleware });
  });
}

// recives a slash command
function slash(req, res, next) {

  // parse out the payload and middleware for the Slack /command POST
  parseSlackMessage(req.body, function (err, data) {

    // payload is passed to each middleware fn
    // each middleware fn is executed in serial by callee executing next()
    var payload = data.payload,
        middleware = data.middleware;

    // sends response to the Slack POST

    function message(msg) {
      // override the response message to appear in channel it was requested from
      msg.channel = payload.message.channel_id;
      // use the reponse_url property to get over 3s window to respond 
      var url = payload.message.response_url;
      var headers = { 'Content-Type': 'application/json' };
      var body = JSON.stringify(msg);
      _request2.default.post({ url: url, headers: headers, body: body }, function (err) {
        if (err) {
          res.json({ text: err });
        } else {
          res.status(200).end();
        }
      });
    }

    // named iife for the first middleware fn
    ;(function iterator(i) {
      // grab the next middleware fn to exec
      var next = iterator.bind(null, i + 1);
      // exec the current middleware with args
      middleware[i].call({}, payload, message, next);
    })(0);
  });
}
module.exports = exports['default'];