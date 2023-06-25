const jwt = require("jsonwebtoken");
const config = require("../config/config");
const { tokenTypes } = require("../config/tokens");

/**
 * Generate jwt token
 * - Payload must contain fields
 * --- "sub": `userId` parameter
 * --- "type": `type` parameter
 *
 * - Token expiration must be set to the value of `expires` parameter
 *
 * @param {ObjectId} userId - Mongo user id
 * @param {Number} expires - Token expiration time in seconds since unix epoch
 * @param {string} type - Access token type eg: Access, Refresh
 * @param {string} [secret] - Secret key to sign the token, defaults to config.jwt.secret
 * @returns {string}
 */
const generateToken = (userId, expires, type, secret = config.jwt.secret) => {
  // console.log("type", tokenTypes)
  const payload ={
    sub: userId,
    type: type,
    exp: expires,
    iat:Date.now()/1000,
  }

  const token = jwt.sign(payload, secret)
  // res.send(token)
  // console.log(token)
  return token

};



/**
 * Generate auth token
 * - Generate jwt token
 * - Token type should be "ACCESS"
 * - Return token and expiry date in required format
 *
 * @param {User} user
 * @returns {Promise<Object>}
 *
 * Example response:
 * "access": {
 *          "token": "eyJhbGciOiJIUzI1NiIs...",
 *          "expires": "2021-01-30T13:51:19.036Z"
 * }
 */
const generateAuthTokens = async (user) => {
//   try {
//     let userId = user._id;
//   const expires= config.jwt.accessExpirationMinutes
//   const type = tokenTypes
//   let date = new Date();
//   date.setMinutes(date.getMinutes()+expires)

//   const accessToken = await generateToken(userId, expires, type)

//   res = { 
//     access:{
//     token: accessToken,
//     expires: date
//   }
// }
//   // console.log(res)

//   return res;
  
//   } catch (error) {
//     return error;
//   }

const expires = Math.floor(Date.now()/1000) + config.jwt.accessExpirationMinutes * 60 ;
  const accessToken = generateToken(user.id, expires ,tokenTypes.ACCESS)
  return {
    access:{
      token:accessToken,
      expires:new Date(expires * 1000)
    }
  }
  
};

// const user = {

//     "user": {

//         "walletMoney": 500,

//         "address": "ADDRESS_NOT_SET",

//         "_id": "600fe9214b2d2904820403c5",

//         "name": "crio-users",

//         "email": "crio-user@gmail.com",

//         "password": "criouser123",

//         "createdAt": "2021-01-26T10:04:17.098Z",

//         "updatedAt": "2021-01-26T10:04:17.098Z",

//         "__v": 0

//     }
//   }
//   generateAuthTokens(user);

module.exports = {
  generateToken,
  generateAuthTokens,
};
