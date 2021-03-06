'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = install;

var _install2 = require('../methods/_install');

var _install3 = _interopRequireDefault(_install2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// register the integration account (effectively the app owner)
function install(req, res, next) {
  var templateName = req.app.get('template');
  if (req.query.error === 'access_denied') {
    res.status(403).render(templateName, {
      ok: false,
      msg: 'access denied'
    });
  } else {
    (0, _install3.default)(req.query.code, function (err, success) {
      if (err) {
        res.status(500).render(templateName, {
          ok: false,
          msg: err
        });
      } else {
        res.render(templateName, {
          ok: true,
          msg: 'Successfully installed'
        });
      }
    });
  }
}
module.exports = exports['default'];