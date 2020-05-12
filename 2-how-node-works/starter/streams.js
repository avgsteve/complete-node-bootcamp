/*jshint esversion: 6 */
/*jshint esversion: 8 */
// 37. Streams in Practice  //  https://www.udemy.com/course/nodejs-express-mongodb-bootcamp/learn/lecture/15064754

const fs = require('fs');
const server = require("http").createServer();


server.on("request", (req, res) => {

  // // Solution 1
  // fs.readFile("test-file.txt", (err, data) => {
  //   if (err) console.log(err);
  //   res.end(data);
  // });

  // //Solution 2: Streams
  // //fs.createReadStream(path[, options])
  // const readable = fs.createReadStream("test-file.txt");
  //
  // readable.on("data", chunk => {
  //   res.write(chunk);
  // });
  //
  // readable.on("end", () => {
  //   res.end();
  // });
  //
  // readable.on("error", err => {
  //   console.log(err);
  //   res.statusCode = 500; //dev tool => Network => Status will be 500
  //   res.end("File not found!");
  // });

  // Solution 3
  const readable = fs.createReadStream("test-file.txt");
  readable.pipe(res);
  // readableSource.pipe(writeableDest); //writable destination

  // end of server.on("request", (req, res) => {
});

server.listen(8000, "127.0.0.1", () => {
  console.log("Listening...");
});
