'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.cmds = cmds;
exports.slash = slash;
exports.start = start;

var _configure = require('./routes/configure');

var _configure2 = _interopRequireDefault(_configure);

var _button = require('./methods/button');

var _button2 = _interopRequireDefault(_button);

var _find = require('./methods/find');

var _find2 = _interopRequireDefault(_find);

var _save = require('./methods/save');

var _save2 = _interopRequireDefault(_save);

var _chalk = require('chalk');

var _chalk2 = _interopRequireDefault(_chalk);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var port = process.env.PORT || 3000;
var cmds = {};

// returns the registered slash commands
function cmds() {
  return cmds;
}

// register a slash command
function slash() {
  for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
    args[_key] = arguments[_key];
  }

  var cmd = args.shift(); // first arg is the cmd
  cmds[cmd] = args; // rest of them are middlewares
}

// starts the server 
function start() {
  var name = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : process.env.APP_NAME || 'slack-app';

  return _configure2.default.listen(port, function (x) {
    if (process.env.NODE_ENV === 'development') {
      var msg = _chalk2.default.green('#!/' + name + '>');
      var url = _chalk2.default.underline.cyan('http://localhost:' + port);
      console.log(msg + ' ' + url);
    }
  });
}

// app declarative defn api
_configure2.default.cmds = cmds;
_configure2.default.slash = slash;
_configure2.default.start = start;
_configure2.default.button = _button2.default;

// app account persistence apis
_configure2.default.find = _find2.default;
_configure2.default.save = _save2.default;

// the app, is just an express app
exports.default = _configure2.default;