/*jshint esversion: 6 */
/*jshint esversion: 8 */
// 35. Events in Practice //  https://www.udemy.com/course/nodejs-express-mongodb-bootcamp/learn/lecture/15064750

const EventEmitter = require("events");
const http = require("http");
const url = require('url');


class Sales extends EventEmitter {
  constructor() {
    super();
  }
  //https://nodejs.org/api/events.html#events_class_eventemitter
}

const myEmitter = new Sales();

//emitter.on(eventName, listener)
//myEmitter.on() can observe the corresponding .emit event with the  the same parameter
myEmitter.on("newSale", () => {
  console.log("There was a new sale!");
});

myEmitter.on("newSale", () => {
  console.log("Costumer name: Jonas");
});


myEmitter.on("newSale", stock => {
  //Via myEmitter.emit("newSale", 9); , the stock parameter receive the value of 9
  console.log(`There are now ${stock} items left in stock.`);
});

myEmitter.emit("newSale", 9);

/*
There was a new sale!
Costumer name: Jonas
There are now 9 items left in stock.
Waiting for requests...
*/

//////////////////

const server = http.createServer();

server.on("request", (req, res) => {
  console.log("===============\nRequest received!");
  console.log("The request url: " + req.url);
  res.end("Request received");
});

server.on("request", (req, res) => {
  console.log("Another request :) ...");
});


server.on("close", () => {
  console.log("Server closed");
});
// 還沒研究出來怎麼使用  server.close() 的功能
// server.on("close", (req, res) => {
//   if (req.url === "/close") {
//     setImmediate(function() {
//       server.close(() => {
//         console.log("Server closed");
//       });
//     });
//   }
// });

server.listen(8000, "127.0.0.1", () => {
  console.log("Waiting for requests...");
});
