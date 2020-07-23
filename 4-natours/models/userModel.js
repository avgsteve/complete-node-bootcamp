 /*jshint esversion: 6 */
 /*jshint esversion: 8 */
 const path = require('path');
 // const dotenv = require('dotenv');
 const mongoose = require('mongoose');
 const slugify = require('slugify');
 const validator = require('validator');
 const bcrypt = require('bcryptjs');
 const crypto = require('crypto');

 const Schema = mongoose.Schema;

 const userSchema = new Schema({
     // schema options ref:
     // https://mongoosejs.com/docs/guide.html#definition
     name: {
       type: String,
       required: [
         true,
         'Please let us know your name!'
       ]
     },
     email: {
       type: String,
       required: [
         true,
         'Please let us know your name!'
       ],
       unique: true,
       lowercase: true, //For example, if you want to lowercase a string before saving:
       validate: [validator.isEmail],
     },
     photo: {
       // path name will be String type
       type: String,
       default: 'default.jpg'
     },
     role: {
       type: String,
       enum: ['user', 'guide', 'lead-guide', 'admin'],
       default: 'user'
     },
     password: {
       type: String,
       required: [true, 'Please provide a password'],
       minlength: 8,
       // maxlength: 12,
       select: false, // won't be shown in results
     },
     passwordConfirm: {
       type: String,
       required: [true, 'Please confirm your password'],
       validate: {
         //This works only on create and save ( .()save ),
         validator: function(el) {
           return this.password === el;
         },
         message: 'Passwords are not the same!',
       }
     },
     passwordChangedAt: Date,
     passwordResetToken: String, // will be generated by userSchema.methods.createPasswordResetToken = function() {
     passwordResetExpires: Date,
     active: {
       type: Boolean,
       default: true,
       select: false // the active field  won't be shown is query results
     }
   },
   // //the second parameter (obj) is schema options
   // {
   //   toJSON: {
   //     virtuals: true
   //   },
   //   toObject: {
   //     virtuals: true
   //   },
   // }
 );

 // HASHING ALL CHANGED PASSWORD with .pre save middleware & bcryptjs if the change of password is detect
 // https://mongoosejs.com/docs/middleware.html#pre
 userSchema.pre('save', async function(next) {

   //This if statement with the next() runs only when the password property is modified
   //this.isModified is a method from Model itself that returns boolean when doc is is modified. argument is the name of property
   if (!this.isModified('password')) {
     return next();
   }

   //salt = random string // https://www.npmjs.com/package/bcryptjs
   // .hash method return a async Promise so use this whole callback as async
   this.password = await bcrypt.hash(this.password, 12); // hash the password with cost of 12

   //delete the value of passwordConfirm property
   this.passwordConfirm = undefined;

   next();

 });


 userSchema.pre('save', function(next) {

   /*
   // Use this.isModified() with argument as the field names to get boolean value which shows if the field has been updated or not
   // ref: https://mongoosejs.com/docs/api.html#document_Document-isModified

   // Use Document.prototype.isNew, the "isNew" property which its value is true when the document is new
   // https://mongoosejs.com/docs/api.html#document_Document-isNew
   */
   if (!this.isModified('password') || this.isNew) {
     return next();
   }

   // deduct 1 second from Date.now() to make sure the recored time of new token is always before new password is created
   this.passwordChangedAt = Date.now() - 1000; //ex: passwordChangedAt:  2020-06-12T05:30:12.163+00:00
   next();


 });

 //middleware for any query start with "find" key word
 userSchema.pre(/^find/, function(next) {
   /*pre middleware will be looking for the this.op (any operation through this schema: userSchema)property's value */


   // console.log('\nThis is a log in userModels.js pre(/^find/) middleware:\n');
   //this.op is used to show which Query method is used in current query
   // console.log(this.op); //find

   // console.log('\n== end of log ==\n');

   //this points to current query
   this.find({
     active: {
       $ne: false
     }
   });

   next();

 });

 //
 userSchema.methods.correctPassword = async function(candidatePassword, userPassword) {

   //candidatePassword is the raw password (not signed or not encrypted) from req.body
   //userPassword is the encrypted password from query (query.findOne) result
   return await bcrypt.compare(candidatePassword, userPassword); //will return boolean

   //Due to the field

   // ref for creating new prototype method:
   // https://mongoosejs.com/docs/api/schema.html#schema_Schema-method
 };


 //Check if the password has been updated (returns Boolean) with methods called by authController.protect
 userSchema.methods.changedPasswordAfter = function(JWTTimestamp) { //The parameter "JWTTimestamp" shoukl receive JWT Token time (the time stamp in a decoded JWT token from authController.protect)

   // 1) if the property passwordChangedAt: Date exists, then do the comparison
   // Note: passwordChangedAt property will be added when .pre middleware detects an password field update
   if (this.passwordChangedAt) {

     //Convert the time in passwordChangedAt (Unix Epoch time) to base10 number
     //use .getTime() method as passwordChangedAt property is a Date object
     const changedTimeStamp = parseInt(this.passwordChangedAt.getTime() / 1000,
       10 //base10 number
     );

     console.log("\x1b[32m" + '\nThe log from userSchema.methods.changedPasswordAfter:\nChecking if the password has been updated by comparing the time when password changed vs the time JWT was generated.\n' + "\x1b[0m");

     console.log(`The last time password was changed at: \n  ===> ${new Date(changedTimeStamp * 1000)}, \nThe JWT was generated at: \n  ===> ${new Date(JWTTimestamp * 1000)}`);

     // Note: Check if the password has been updated
     // by comparing changedTimeStamp vs. JWTTimestamp (time stamp when token is created)
     // Returns true if password changed after the time JWT token was created
     return changedTimeStamp > JWTTimestamp;
   }

   // 2) If two time stamps (changedTimeStamp and JWTTimestamp) has equal value or changedTimeStamp has smaller value, then the token is valid (not generated before password changed)
   return false;
 };


 // will be called inside the middleware forgotPassword in authController.js
 // as prototype chain method in the User schema and will be inherited by Query result due to prototype chain
 userSchema.methods.createPasswordResetToken = function() {

   // generat (random) token string that will be used to reset password and turn to base10

   // const resetToken2 = crypto.randomBytes(32); //!!! not URL-friendly
   /*   const resetToken = crypto.randomBytes(32);  ==> logged content:
   {
   resetToken: <Buffer c5 ee 58 60 7e 06 9d bc ea c9 95 44 97 60 d6 90 a6 af 30 af c7 5e ca 05 17 10 42 9c 57 f6 e8 2a>
   }
   // resetToken.length: 32
   */

   //
   const resetToken = crypto.randomBytes(32).toString('hex'); //!!! URL-friendly string
   /*  const resetToken = crypto.randomBytes(32).toString('hex');  ==> logged content:
   {
     resetToken: 'fcf8452276541f5da5103ad9de7fb09feee19040eb01d54f986bc4d80dfa076f'
   }
   // resetToken.length: 64
   */

   // ref for crypto.randomBytes :
   // https://nodejs.org/api/crypto.html#crypto_crypto_randombytes_size_callback


   //================= PLAIN STRING FOR RESETTING PASSWORD =====================
   //assign(or say update) the hashed token to the field ".passwordResetToken " in schema field
   //and the value of property .passwordResetToken will be sent to user via email to reset password
   this.passwordResetToken = crypto.createHash('sha256').update(resetToken).digest('hex'); // hashed token   ex: b1be70e2d5578161c4a602c45e5e1392b23729c15de4bf4289c418ece009c2da

   //ref:
   // #1: .createHash()     crypto.createHash(algorithm[, options])
   // Creates and returns a Hash object that can be used to generate hash digests using the given algorithm
   // https://nodejs.org/api/crypto.html#crypto_crypto_createhash_algorithm_options

   // #2: .update()         hash.update(data[, inputEncoding]) ):
   // Updates the hash content with the given data, the encoding of which is given in inputEncoding
   // https://nodejs.org/api/crypto.html#crypto_hash_update_data_inputencoding

   // #3: .digest()         hash.digest([encoding])
   // Calculates the digest of all of the data passed to be hashed (using the hash.update() method). If encoding is provided a string will be returned; otherwise a Buffer is returned.
   // https://nodejs.org/api/crypto.html#crypto_hash_digest_encoding


   console.log({ //use curly bracket to show variable name and value
       resetToken // (not hashed) { resetToken: 'a66c978cdf8d476488bb7a5e2f3223ca3fd52ac7115b3b1779a0ed7fb79cc576' }
     },
     resetToken.length, // 64
     // {
     //   resetToken2
     // },
     // resetToken2.length,
     this.passwordResetToken // (hashed with sha256) '54562e8a62656245dc270435c8b51343aee74310588cedac07da925442023179'
   );

   //adding the time stamp right at the moment the passwordResetToken is called (1000 milliseconds * 60 second * 10 minutes)
   this.passwordResetExpires = Date.now() + 1000 * 60 * 10;

   // return the reset token to the middleware function such as "forgotPassword"
   return resetToken;

 };


 const User = mongoose.model('User', userSchema);

 module.exports = User;