/*jshint esversion: 6 */
/*jshint esversion: 8 */
console.log(arguments);

// ================== test-module-1.js
// module.exports
const C = require('./test-module-1');
const calc1 = new C();
console.log(calc1.add(2, 5));

/* in test-module-1.js
class Calculator {
  add(a, b) {
    return a + b;
  }

  multiply(a, b) {
    return a * b;
  }

  divide(a, b) {
    return a / b;
  }
}

module.exports = Calculator;
*/


// ================== test-module-2.js
// exports (add property to exports obj itself)
// const calc2 = require("./test-module-2");
// 透過assignment 讓 variable取得物件的
const {
  add,
  multiply
} = require("./test-module-2");
console.log(multiply(2, 5));
console.log(exports);
/* in test-module-2.js
exports.add = (a, b) => a + b;
exports.multiply = (a, b) => a * b;
exports.divide = (a, b) => a / b;
*/

// ================== test-module-3.js
// caching
require("./test-module-3")();
require("./test-module-3")();
require("./test-module-3")();

// Hello from the module-3     <---只會執行一次
// Log this beautiful text 😍
// Log this beautiful text 😍
// Log this beautiful text 😍

/*
console.log("Hello from the module");
//Top level code
module.exports = () => console.log("Log this beautiful text 😍");
*/



// (function(exports, require, module, __filename, dirname) {
//   // Module code here
// });

// [Arguments]
/*
(function (exports, require, module, __filename, dirname) {

});

const argument = {
  '0': {},
  '1': [Function: require] {
    resolve: [Function: resolve] {
      paths: [Function: paths]
    },
    main: Module {
      id: '.',
      path: 'D:\\Dropbox\\Udemy\\JavaScript\\complete-node-bootcamp\\2-how-node-works\\starter',
      exports: {},
      parent: null,
      filename: 'D:\\Dropbox\\Udemy\\JavaScript\\complete-node-bootcamp\\2-how-node-works\\starter\\modules.js',
      loaded: false,
      children: [],
      paths: [Array]
    },
    extensions: [Object: null prototype] {
      '.js': [Function],
      '.json': [Function],
      '.node': [Function]
    },
    cache: [Object: null prototype] {
      'D:\\Dropbox\\Udemy\\JavaScript\\complete-node-bootcamp\\2-how-node-works\\starter\\modules.js': [Module]
    }
  },
  '2': Module {
    id: '.',
    path: 'D:\\Dropbox\\Udemy\\JavaScript\\complete-node-bootcamp\\2-how-node-works\\starter',
    exports: {},
    parent: null,
    filename: 'D:\\Dropbox\\Udemy\\JavaScript\\complete-node-bootcamp\\2-how-node-works\\starter\\modules.js',
    loaded: false,
    children: [],
    paths: [
      'D:\\Dropbox\\Udemy\\JavaScript\\complete-node-bootcamp\\2-how-node-works\\starter\\node_modules',
      'D:\\Dropbox\\Udemy\\JavaScript\\complete-node-bootcamp\\2-how-node-works\\node_modules',
      'D:\\Dropbox\\Udemy\\JavaScript\\complete-node-bootcamp\\node_modules',
      'D:\\Dropbox\\Udemy\\JavaScript\\node_modules',
      'D:\\Dropbox\\Udemy\\node_modules',
      'D:\\Dropbox\\node_modules',
      'D:\\node_modules'
    ]
  },
  '3': 'D:\\Dropbox\\Udemy\\JavaScript\\complete-node-bootcamp\\2-how-node-works\\starter\\modules.js',
  '4': 'D:\\Dropbox\\Udemy\\JavaScript\\complete-node-bootcamp\\2-how-node-works\\starter'
}
*/
