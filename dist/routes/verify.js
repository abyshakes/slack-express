'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = verify;

var _scmp = require('scmp');

var _scmp2 = _interopRequireDefault(_scmp);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function verify(req, res, next) {
  var mode = process.env.NODE_ENV;
  var legit = (0, _scmp2.default)(req.body.token, process.env.SLACK_VERIFICATION_TOKEN);
  if (mode === 'production') {
    next(legit ? null : Error('token not verified'));
  } else {
    next();
  }
}
module.exports = exports['default'];