require('../min-require.js');
var expect = require('chai').expect;
main();

function main() {
  var define = global.define;
  var require = global.require;

  define('A', function(require, module, exports) {
    exports.A = 'A';
    exports[10] = 20;
  });

  define('B', function(require, module, exports) {
    A = require('A');

    module.exports = 'B require ' + A.A;
  });

  define('C', function(require, module, exports) {
    A = require('A');
    B = require('B');

    expect(A[10]).equal(20);
    expect(B).equal('B require A');
  });

  require('C');
}
