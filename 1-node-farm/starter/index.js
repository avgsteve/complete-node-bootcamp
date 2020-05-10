/*jshint esversion: 6 */
/*jshint esversion: 8 */
//node ducumentation   https://nodejs.org/dist/latest-v12.x/docs/api/
//fs = file system   https://nodejs.org/dist/latest-v12.x/docs/api/fs.html
const fs = require('fs');
const http = require('http');

// // === fs.readFileSync(path[, options]) // Blocking code execution
// const textIn = fs.readFileSync('./txt/input.txt', 'utf-8');
// console.log(textIn);
// const textOut = `This is what we know about avocado: ${textIn}. \n Created on ${Date.now()}`;
// //fs.writeFileSync(file, data[, options])
// fs.writeFileSync('./txt/output.txt', textOut);
// console.log('File has been overwritten!');
// console.log(textOut);

// === Non-blocking (Asyncronous way) // fs.readFile(path[, options], callback)
// fs.readFile('./txt/start.txt', 'utf-8', (err, data) => {
//   console.log(data);
// });
// console.log('\nReading file ...');

fs.readFile('./txt/start.txt', 'utf-8', (err, data1) => {

  if (err) {
    return console.log('ERROR! ❌ ');
  }

  fs.readFile(`./txt/${data1}.txt`, 'utf-8', (err, data2) => {
    console.log(data2);
    fs.readFile('./txt/append.txt', 'utf-8', (err, data3) => {
      console.log(data3);

      //fs.writeFile(file, data[, options], callback)
      fs.writeFile('./txt/final.txt', `${data2}\n${data3}`, 'utf-8', err => {
        console.log("You file has been written! \u2728");
      });
    });
  });
});
console.log('Reading file 1 & 2...');
