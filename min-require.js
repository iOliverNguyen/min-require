;(function(context) {
  var modules = {}, funcs = {}, stack = [];

  // define(id, function(require, module, exports))
  function define(id, callback) {
    if (typeof id !== 'string' || id === '') throw Error('invalid module id ' + id);
    if (funcs[id]) throw Error('dupicated module id ' + id);
    if (typeof callback !== 'function') throw Error('invalid module function');

    funcs[id] = callback;
  }

  // require(id)
  function require(id) {
    if (!funcs[id]) throw Error('module ' + id + ' is not defined');
    if (stack.indexOf(id) > 0) throw Error('circular: ' + stack.join(', '));
    if (modules[id]) return modules[id].exports;

    var m = modules[id] = { id:id, require:require, exports:{} };
    stack.push(id);
    funcs[id](require, m, m.exports);
    stack.pop();

    return m.exports;
  }

  context.define = define;
  context.require = require;
})(typeof window !== 'undefined'? window : global);
