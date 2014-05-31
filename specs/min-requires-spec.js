describe('min-require', function () {

  beforeEach(function () {
    reset();
  });

  it('should inject dependencies', function () {
    var testValue1,
        testValue2;


    define('A', function (require, module, exports) {
      exports.A = 'A';
      exports[10] = 20;
    });

    define('B', function (require, module, exports) {
      A = require('A');

      module.exports = 'B require ' + A.A;
    });

    define('C', function (require, module, exports) {
      A = require('A');
      B = require('B');

      testValue1 = A[10];
      testValue2 = B;
    });

    require('C');
    expect(testValue1).toEqual(20);
    expect(testValue2).toEqual('B require A');
  });

  it('should throw error on circular dependencies', function () {
    define('A', function (require, module, exports) {
      B = require('B');
      C = require('C');

      exports.A = 'A';
      exports.AC = 'A' + C.C;
      exports[10] = 20;
    });

    define('B', function (require, module, exports) {
      A = require('A');
      C = require('C');

      module.exports = 'B require ' + A.A;
    });

    define('C', function (require, module, exports) {
      A = require('A');
      B = require('B');

      exports.C = 'C';
      exports.CA = 'C' + A.A;

    });

    expect(function () {
      require('C');
    }).toThrowError("circular: C, A, B");

  });
});
