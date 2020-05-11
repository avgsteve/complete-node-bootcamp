/*jshint esversion: 6 */
/*jshint esversion: 8 */
//node ducumentation   https://nodejs.org/dist/latest-v12.x/docs/api/
//fs = file system   https://nodejs.org/dist/latest-v12.x/docs/api/fs.html
const fs = require('fs');
const http = require('http');
const url = require('url');

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

// fs.readFile('./txt/start.txt', 'utf-8', (err, data1) => {
//
//   if (err) {
//     return console.log('ERROR! ❌ ');
//   }
//
//   fs.readFile(`./txt/${data1}.txt`, 'utf-8', (err, data2) => {
//     console.log(data2);
//     fs.readFile('./txt/append.txt', 'utf-8', (err, data3) => {
//       console.log(data3);
//
//       //fs.writeFile(file, data[, options], callback)
//       fs.writeFile('./txt/final.txt', `${data2}\n${data3}`, 'utf-8', err => {
//         console.log("You file has been written! \u2728");
//       });
//     });
//   });
// });
// console.log('Reading file 1 & 2...');


// Part 1-1 =================================
const replaceTemplate = (template, product) => {
  //template is HTML in String form(type) , product is Obj
  let output = template.replace(/{%PRODUCTNAME%}/g, product.productName);
  // output is now new string and other template string to be replace too
  output = output.replace(/{%IMAGE%}/g, product.image);
  output = output.replace(/{%PRICE%}/g, product.price);
  output = output.replace(/{%FROM%}/g, product.from);
  output = output.replace(/{%NUTRIENTS%}/g, product.nutrients);
  output = output.replace(/{%QUANTITY%}/g, product.quantity);
  output = output.replace(/{%DESCRIPTION%}/g, product.description);
  output = output.replace(/{%ID%}/g, product.id);

  if (!product.organic) {
    // output = template.replace(/{%NOT_ORGANIC%}/g, product.organic);
    output = output.replace(/{%NOT_ORGANIC%}/g, 'not-organic');
    //        display: none;
  }
  return output; //將修改完的String(HTML code)傳出
}; //end of function replaceTemplate = (template, product)

// Part 1-2 =================================
// saving the json file in variable
// fs.readFileSync(path[, options])
const tempOverview = fs.readFileSync(`${__dirname}/templates/template-overview.html`, 'utf-8');
const tempCard = fs.readFileSync(`${__dirname}/templates/template-card.html`, 'utf-8');
const tempProduct = fs.readFileSync(`${__dirname}/templates/template-product.html`, 'utf-8');
//
const data = fs.readFileSync(`${__dirname}/dev-data/data.json`, 'utf-8');
const dataObj = JSON.parse(data);

// Part 2 server response
// ======== Server (url event and response)
const server = http.createServer((req, res) => {
  // http.createServer([options][, requestListener])

  //
  const pathName = req.url;
  console.log("=======================");
  console.log(`pathName: ${pathName}`); //to show current requested url
  console.log(`req.url: ${req.url}`); //to show current requested url
  //

  console.log('---- url.parse():'); //to show current requested url
  console.log(url.parse(req.url, true)); // ex: 127.0.0.1:8000/product?id=0
  /*  ==>  url.parse(urlString[, parseQueryString[, slashesDenoteHost]])
      urlString <string>  ==>   The URL string to parse.
      parseQueryString <boolean> ==>  If true, the query property will always be set to an object returned by the querystring module's parse() method. If false, the query property on the returned URL object will be an unparsed, undecoded string. Default: false.
  */


  //根據pathName內容進行以下頁面的顯示和處理方式
  // === loads Overview page ===
  if (pathName === '/' || pathName === '/overview') {
    res.writeHead(200, {
      'Content-type': 'text/html'
    });

    // 將JSON(dataObj)的內容，透過function (map + replaceTemplate)轉換要輸出的HTML Array
    const cardsHtml = dataObj.map(element =>
      // 將Array裡面的物件透過map傳入replaceTemplate後替換掉 template-card.html (param: tempCard)中所有的template string的內容 {%XXXX%}

      //replaceTemplate(tempCard, element) 之後 產生的結果是新的Array(存在 cardsHtml)
      replaceTemplate(tempCard, element)).join(''); //.join將map()之後的結果join，將Array內容合併成單一的HTML字串(cardsHtml)

    const output = tempOverview.replace('{%PRODUCT_CARDS%}', cardsHtml);

    res.end(output); //template-overview.html

  } else if (pathName === '/product') {
    res.end("This is PRODUCT");

    // === api page ===
  } else if (pathName === '/api') {

    //callback function的主要內容: 將傳入的JSON檔案顯示在頁面上
    //(data的內容先寫在global scope裡面就不用每一次進入/api的時候都讀取一次)

    // response.writeHead(statusCode[, statusMessage][, headers])
    //  注意 statusCode 要輸入200
    //    headers <Object> 透過包含header內容的物件，作為 parameter傳入
    res.writeHead(200, {
      "Content-type": "application/json",
      'my-own-header': "It's a JSON file!!"
      // check inside the Chrome console => Newwork => Name:  => Header
    });
    // res.end('<h1>API page</h1>');
    res.end(data);
    console.log("route /api loaded!");

    // === "Page not found" page ===
  } else {
    res.writeHead(404, {
      "Content-type": "text/html",
      'my-own-header': 'hello'
      // check inside the Chrome console => Newwork => Name:  => Header
    });
    //
    res.end("<h1>The page is not found!</h1>");
  }

});

//server.listen() Starts the HTTP server listening for connections. This method is identical to server.listen() from net.Server.
server.listen(8000, '127.0.0.1', () => {
  console.log('Listen to request on port 8000');
});
