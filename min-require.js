;
(function (context) {
  var modules,
    funcs,
    stack;

  function reset() {
    modules = {};
    funcs = {};
    stack = [];
  }

  // define(id, function(require, module, exports))
  function define(id, callback) {
    if (typeof id !== 'string' || id === '') throw Error('invalid module id ' + id);
    if (funcs[id]) throw Error('dupicated module id ' + id);
    if (typeof callback !== 'function') throw Error('invalid module function');

    funcs[id] = callback;
  }

  function stubRequire(stub) {
    return function (id) {
        if (!stub.hasOwnProperty(id)) {
          throw new Error('Stub ' + id + ' not found!');
        } else {
          return stub[id];
        }
    };
  }

  // require(id, stub)
  function require(id, stub) {
    var m;
    if (!funcs[id]) throw Error('module ' + id + ' is not defined');
    if (stack.indexOf(id) >= 0) throw Error('circular: ' + stack.join(', '));
    if (stub) {
      m = { id: id, exports: {} };
      funcs[id](stubRequire(stub), m, m.exports);
      return m.exports;
    }
    if (modules[id]) return modules[id].exports;

    m = modules[id] = { id: id, exports: {} };
    stack.push(id);
    funcs[id](require, m, m.exports);
    stack.pop();

    return m.exports;
  }

  reset();
  context.define = define;
  context.require = require;
  context.reset = reset;
})(typeof window !== 'undefined' ? window : global);
