/*jshint esversion: 6 */
/*jshint esversion: 8 */

//// export module內容的方式#1
// class Calculator {
//   add(a, b) {
//     return a + b;
//   }
//
//   multiply(a, b) {
//     return a * b;
//   }
//
//   divide(a, b) {
//     return a / b;
//   }
// }
//
// module.exports = Calculator;

// ==========================

//// export module內容的方式#1
module.exports = class {
  add(a, b) {
    return a + b;
  }

  multiply(a, b) {
    return a * b;
  }

  divide(a, b) {
    return a / b;
  }
};
