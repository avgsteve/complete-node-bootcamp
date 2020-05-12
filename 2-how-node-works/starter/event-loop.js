//33. The Event Loop in Practice  // https://www.udemy.com/course/nodejs-express-mongodb-bootcamp/learn/lecture/15064746#questions/9277412
/*jshint esversion: 6 */
/*jshint esversion: 8 */
const fs = require('fs');
const crypto = require('crypto');
const start = Date.now();
//have only one thread in the THREADPOOL
process.env.UV_THREADPOOL_SIZE = 1;

setTimeout(() => console.log('Timer 1 finished!'));
setImmediate(() => console.log('Immediate 1 finished!'));

fs.readFile("test-file.txt", () => {
  console.log('I/O finished!');
  console.log("----------------------");

  setTimeout(() => console.log('Timer 2 finished!'), 0);
  setTimeout(() => console.log('Timer 3 finished!'), 3000);
  setImmediate(() => console.log('Immediate 2 finished!'));
  /*
  (擷取自 )
  I/O finished!
  ----------------------
  Immediate 2 finished!
  Timer 2 finished!
  Timer 3 finished!
  */
  //nextTick means next loop
  process.nextTick(() => console.log("Process.nextTick"));

  crypto.pbkdf2('password', 'salt', 100000, 1023, 'sha512', () => {
    console.log(Date.now() - start, " Password encrypted!");
  });

  crypto.pbkdf2('password', 'salt', 100000, 1023, 'sha512', () => {
    console.log(Date.now() - start, " Password encrypted!");
  });

  crypto.pbkdf2('password', 'salt', 100000, 1023, 'sha512', () => {
    console.log(Date.now() - start, " Password encrypted!");
  });

  crypto.pbkdf2('password', 'salt', 100000, 1023, 'sha512', () => {
    console.log(Date.now() - start, " Password encrypted!");
  });

  crypto.pbkdf2('password', 'salt', 100000, 1023, 'sha512', () => {
    console.log(Date.now() - start, " Password encrypted!");
  });

  crypto.pbkdf2('password', 'salt', 100000, 1023, 'sha512', () => {
    console.log(Date.now() - start, " Password encrypted!");
  });

  crypto.pbkdf2('password', 'salt', 100000, 1023, 'sha512', () => {
    console.log(Date.now() - start, " Password encrypted!");
  });

  crypto.pbkdf2('password', 'salt', 100000, 1023, 'sha512', () => {
    console.log(Date.now() - start, " Password encrypted!");
  });
});

console.log(Date.now() - start, "Hello from top level code");

/*
Hello from top level code
Timer 1 finished!
Immediate 1 finished!
I/O finished!
----------------------
Immediate 2 finished!
Timer 2 finished!
Timer 3 finished!
*/
