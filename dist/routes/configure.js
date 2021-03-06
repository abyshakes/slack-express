'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _bodyParser = require('body-parser');

var _bodyParser2 = _interopRequireDefault(_bodyParser);

var _morgan = require('morgan');

var _morgan2 = _interopRequireDefault(_morgan);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _button = require('../methods/button');

var _button2 = _interopRequireDefault(_button);

var _index = require('../routes/index');

var _index2 = _interopRequireDefault(_index);

var _slash = require('../routes/slash');

var _slash2 = _interopRequireDefault(_slash);

var _install = require('../routes/install');

var _install2 = _interopRequireDefault(_install);

var _verify = require('../routes/verify');

var _verify2 = _interopRequireDefault(_verify);

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var bb = (0, _express2.default)();
bb.set('template', 'slack-express');
bb.disable('x-powered-by');

// default template locals
bb.locals.ok = true;
bb.locals.msg = '';
bb.locals.button = _button2.default;
bb.locals.scope = 'incoming-webhook,commands';

// default views
bb.set('view engine', 'ejs');
bb.set('views', _path2.default.join(__dirname, '..', 'views'));

function ensureTemplate(template) {
  _fs2.default.stat(template, function (err, stats) {
    if (err) {
      console.error('Supplied template not found at ' + template + '. Using default. Please check your template path. Thanks!');
    } else if (stats.isFile()) {
      bb.set('template', template);
    }
  });
}

// override view settings from parent app
bb.on('mount', function (parent) {
  var parentTemplate = parent.get('template');
  if (!parentTemplate) {
    return;
  }
  ensureTemplate(parentTemplate);
});

function validateEnv(req, res, next) {
  var required = ['NODE_ENV', 'APP_NAME', 'SLACK_CLIENT_ID', 'SLACK_CLIENT_SECRET'];
  var bad = required.filter(function (k) {
    return typeof process.env[k] === 'undefined';
  });
  var err = bad.length ? Error('missing env vars: ' + bad.join(', ')) : null;
  // force the client_id
  bb.locals.client_id = process.env.SLACK_CLIENT_ID;
  next(err);
}

// middlewares
bb.use(validateEnv);
bb.use((0, _morgan2.default)('dev'));
bb.use(_bodyParser2.default.json());
bb.use(_bodyParser2.default.urlencoded({ extended: true }));

// default routes
bb.get('/', _index2.default);
bb.post('/', _verify2.default, _slash2.default);
bb.get('/auth', _install2.default);

exports.default = bb;
module.exports = exports['default'];