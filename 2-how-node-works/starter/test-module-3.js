console.log("Hello from the module-3");
module.exports = () => console.log("Log this beautiful text 😍");


//in test-module-3.js
//// caching
//require("./test-module-3")();


//Udemy上的提問內容:  Understanding of caching
//https://www.udemy.com/course/nodejs-express-mongodb-bootcamp/learn/lecture/15064760#questions/9253894

// So just want to make sure I understand the caching concept:
//
// The first time when we run require("./test-module-3")(); it reads the entire file, so that's why the console.log('Hello from the module) message is displayed, and it also stores module.exports = () => console.log(“Log this bea…..) into the cache but not the first console.log message.
//
//
//
// Then when we call require("./test-module-3")(); again it will only retrieve what is in cache and not read the entire file. For this instance  its what's assigned to module.exports that is in the cache.
//
//
//
// Thus, is whatever we assign module.exports = ....  are these the only things that will be put in the cache?

// Adam — Teaching Assistant
//
// Yep, that's correct!
