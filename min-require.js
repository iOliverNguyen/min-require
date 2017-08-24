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
  // or
  // define(id, [dep1, ...], function (module1, ...))
  function define(id, deps, callback) {
    if (typeof id !== 'string' || id === '') throw new Error('invalid module id ' + id);
    if (funcs[id]) throw new Error('dupicated module id ' + id);
    
    if (typeof deps === 'function') {
      funcs[id] = deps; // callback
      return;
    } 

    if (typeof callback !== 'function') throw new Error('invalid module function');

    funcs[id] = function (require, module, exports) {
      return callback.apply(this, deps.map(function (dep) {
        if (dep === 'exports') return exports;
        return require(dep);
      }));
    }
  }

  define.amd = {};

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
    if (!funcs[id]) throw new Error('module ' + id + ' is not defined');
    if (stack.indexOf(id) >= 0) throw new Error('circular: ' + stack.join(', '));
    if (stub) {
      m = { id: id, exports: {} };
      m.exports = funcs[id](stubRequire(stub), m, m.exports) || m.exports;
      return m.exports;
    }
    if (modules[id]) return modules[id].exports;

    stack.push(id);
    m = modules[id] = { id: id, exports: {} };
    m.exports = funcs[id](require, m, m.exports) || m.exports;
    stack.pop();

    return m.exports;
  }

  reset();
  context.define = define;
  context.require = require;
  context.reset = reset;
})(typeof window !== 'undefined' ? window : global);
