# min-require

> Minimal implementation of CommonJS require API

## Introduction

This tiny library provides a way to organize your client-side scripts in CommonJs style.
It only implements minimum features that required to work and nothing more.
It also detects circular dependency and throws error. The behaviour is differ from NodeJs
while NodeJs tries to return uninitialized exports object when resolving circular dependency.

**Example:**

```js
define('foo', function(require, module, exports) {

  exports.hello = 'Hello';
  exports.world = 'World';

});

define('my-module', function() {

  var foo = require('foo');
  module.exports = foo.hello + ' ' + foo.world;

});

console.log(require('my-module'));   // 'Hello World'
```

**Example 2:**

```js
define('A', function(require, module, exports) {
  require('B');
});

define('B', function(require, module, exports) {
  require('A');
});

require('A');   // Error: circular: A, B
```

## Using in browser

* Include min-require.js in &lt;script&gt; tag
* Define your modules
* Require at least one module in main script
* A module must be required (directly or indirectly) from main script in order to run

```js
define('fibonacci', function(require, module, exports) {

  module.exports = function f(n) {
    if (typeof n !== 'number' || n < 0) throw new Error('Invalid argument')
    if (n === 0) return 1;
    if (n === 1) return 2;
    return f(n-1) + f(n-2);
  };

});

define('app', function(require, module, exports) {

  var fibonacci = require('fibonacci');
  console.log(fibonacci(10));   // 144

});

require('app');
```

## Testing

```js
define('AlphaModule', function (require, module) {
  function getName() {
    return 'AlphaModule';
  }

  module.exports = {
    getName: getName
  };
});

define('BravoModule', function (require, module) {
  var alpha = require('AlphaModule');
  function getName() {
      return 'BravoModule' + 'On' + alpha.getName();
  }

  module.exports = {
    getName: getName
  };
});
```

```js
describe('BravoModule', function () {
  it('should be easily tested', function () {
    var SUT = require('BravoModule', {
      AlphaModule: {getName: function () {return 'StubAlphaModule'}}
    });
    expect(SUT.getName()).toEqual('BravoModuleOnStubAlphaModule');
  });
});
```

## Using with Gulp

This library was originally created for working with [gulp-wrap-require](https://github.com/ng-vu/gulp-wrap-require).
You can find the more completed example here: [mithril-boilerplate](https://github.com/ng-vu/mithril-boilerplate).

Sample **gulpfile.js**:

```js
var wrapRequire = require('gulp-wrap-require');
var concat = require('gulp-concat');

gulp.task('buildAppScripts', function(cb) {
  gulp.src('src/app/**/*.js'), {base: 'src/app'})
    .pipe(wrapRequire())
    .pipe(concat('main.js'))
    .pipe(gulp.dest('build/assets')
    .on('end', cb || function(){})
    .on('error', console.log);
});
```

**Sample directory tree:**

```
/
  build/
    assets/
  src/
    app/
      alpha/
        a.js
      beta/
        b.js
      foo.js
      bar.js
```

**Result:**

Running `gulp buildAppScripts` on above directory tree will yield **build/assets/main.js**:

```js
define('alpha/a', function() {
  // src/app/alpha/a.js
});

define('beta/b', function() {
  // src/app/beta/b.js
});

define('foo', function() {
  // src/app/foo.js
});

define('bar', function() {
  // src/app/bar.js
});
```

## API

### define

```js
define(id, callback)
```

Define a module.

* **id** must be string and unique
* **callback**: `function(require, module, exports)`


### require

```js
require(id, stub)
```

Require a module. If stub object is specified it will stub out all dependencies using the stub object.

* **Return**: exports object
* **id** must be defined
* **stub**: (optional) `{dependency1: {method1: function () {}, method2: function () {}}}`

### reset

```js
reset()
```

Forgets about every previously defined module. Useful for testing.

## License

MIT.
