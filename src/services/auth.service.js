const httpStatus = require("http-status");
const userService = require("./user.service");
const ApiError = require("../utils/ApiError");
// const bcrypt = require('bcrypt')
const {User}  = require("../models/user.model");

/** 
 * Login with username and password
 * - Utilize userService method to fetch user object corresponding to the email provided
 * - Use the User schema's "isPasswordMatch" method to check if input password matches the one user registered with (i.e, hash stored in MongoDB)
 * - If user doesn't exist or incorrect password,
 * throw an ApiError with "401 Unauthorized" status code and message, "Incorrect email or password"
 * - Else, return the user object
 *
 * @param {string} email  
 * @param {string} password 
 * @returns {Promise<User>}  
 */
const loginUserWithEmailAndPassword = async (email, password) => {
  let userObj = await userService.getUserByEmail(email)
  // let candidatePass = userObj.password
  // if(!user || !(await user.isPasswordMatch(password))){}
//   User.isPasswordMatch(candidatePass, function(err, isMatch) {
//     if (err) throw err;
    // console.log("email2", email); // -> Password123: true
    ///home/crio-user/workspace/riyanadutta22-ME_QKART_BACKEND/frontend console.log("password", password); // -> Password123: true
    // console.log("userobj", userObj); // -> Password123: true
// });
  // const isMatch = await userObj.isPasswordMatch(password)
    // console.log(isMatch)
  // const isMatch = await bcrypt.compare(password, candidatePass);

  // if(isMatch){
  //   return userObj 
  // }else{
  //   throw new ApiError(httpStatus.UNAUTHORIZED, "Incorrect email or password");
  // }
  console.log("myuser obj",userObj)
  if(!(userObj)||!(await userObj.isPasswordMatch(password))){
    throw new  ApiError(httpStatus.UNAUTHORIZED,"Incorrect email or password")
  }
    return userObj
  
};

module.exports = {
  loginUserWithEmailAndPassword,
};
