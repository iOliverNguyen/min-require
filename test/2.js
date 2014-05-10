require('../min-require.js');
var expect = require('chai').expect;
main();

function main() {
  var define = global.define;
  var require = global.require;

  define('A', function(require, module, exports) {
    B = require('B');
    C = require('C');

    exports.A = 'A';
    exports.AC = 'A' + C.C;
    exports[10] = 20;
  });

  define('B', function(require, module, exports) {
    A = require('A');
    C = require('C');

    module.exports = 'B require ' + A.A;
  });

  define('C', function(require, module, exports) {
    A = require('A');
    B = require('B');

    exports.C = 'C';
    exports.CA = 'C' + A.A;

  });

  try {
    require('C');

  } catch(e) {
    expect(e.toString()).contain('C A B');
  }
}
