/*jshint esversion: 6 */
/*jshint esversion: 8 */
/*jshint esversion: 10 */
module.exports = (template, productObj) => {
  /* 將原本的const replaceTemplate = (template, productObj) => { 改成
  module.exports = (template, productObj) => {
  作為module輸出(anonymous function)讓其他檔案使用
  */

  // const replaceTemplate = (template, productObj) => {
  //template is HTML in String form(type) , product is Obj
  let output = template.replace(/{%PRODUCTNAME%}/g, productObj.productName);
  // output is now new string and other template string to be replace too
  output = output.replace(/{%IMAGE%}/g, productObj.image);
  output = output.replace(/{%PRICE%}/g, productObj.price);
  output = output.replace(/{%FROM%}/g, productObj.from);
  output = output.replace(/{%NUTRIENTS%}/g, productObj.nutrients);
  output = output.replace(/{%QUANTITY%}/g, productObj.quantity);
  output = output.replace(/{%DESCRIPTION%}/g, productObj.description);
  output = output.replace(/{%ID%}/g, productObj.id);

  if (!productObj.organic) {
    // output = template.replace(/{%NOT_ORGANIC%}/g, product.organic);
    output = output.replace(/{%NOT_ORGANIC%}/g, 'not-organic');
    //        display: none;
  }
  return output; //將修改完的String(HTML code)傳出
}; //end of function replaceTemplate = (template, product)
