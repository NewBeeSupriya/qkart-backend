const {User}  = require("../models");
const httpStatus = require("http-status");
const ApiError = require("../utils/ApiError");
const bcrypt = require("bcryptjs"); 
const saltRounds = 10;
// comment to create a commit
// TODO: CRIO_TASK_MODULE_UNDERSTANDING_BASICS - Implement getUserById(id)
/** // comment added to push again
 * Get User by id
 * - Fetch user object from Mongo using the "_id" field and return user object
 * @param {String} id  
 * @returns {Promise<User>} 
 */ 
// class userService {  
    const getUserById = async(id) =>{
       
            const data = await User.findOne({ "_id": id })
            return data; 
        
    }

    const getUserByEmail = async(email) => {
            // console.log("inside getby email", password)

            const data = await User.findOne({email});
        return data;
        
    }

    const createUser = async(data) => {
        //throw error for email already used ***
                    //first email is taken or not***
            //email not allowed to be empty***
            //name is required***
       
            // const { name, email, password }= data;
            // if(!email){
            //     throw new ApiError(httpStatus.BAD_REQUEST, "email is required");
            // }
            // if(!name){
            //     throw new ApiError(httpStatus.BAD_REQUEST, "name is required");
            // }
            // if(!password){
            //     throw new ApiError(httpStatus.BAD_REQUEST, "password is required");
            // }
            // // console.log("email",email)
            // let taken = await User.isEmailTaken({email});
            // // console.log("taken", taken)
            // if(!taken){
            //     // const newUser = new User({
            //     // email, password 
            //     // })
            //     // const result = await newUser.create({email:email, pass});
            //     const result = await User.create({...data});
            //     // console.log("res",result)
            //     return result;
            // } 
            //     throw new ApiError(httpStatus.OK, "email alredy taken");
            if(await User.isEmailTaken(data.email)){
                // // return res.send(httpStatus.NOT_ACCEPTABLE).json({message: "Email already taken"});
                throw new ApiError(httpStatus.OK, "Email already taken"); 
            }
            if(!data.email){
                throw new ApiError(httpStatus.BAD_REQUEST, "Email is not allowed to be empty");
            }
            if(!data.name){
                throw new ApiError(httpStatus.BAD_REQUEST, "Name field is required");
            }
            if(!data.password){
                throw new ApiError(httpStatus.BAD_REQUEST, "Password field is required");
            }

             const salt = bcrypt.genSaltSync(saltRounds);
             data.password = bcrypt.hashSync(data.password, salt);

            const user = await User.create({...data})
            return user;
} 


// TODO: CRIO_TASK_MODULE_UNDERSTANDING_BASICS - Implement getUserByEmail(email)

/**
 * Get user by email
 * - Fetch user object from Mongo using the "email" field and return user object
 * @param {string} email
 * @returns {Promise<User>}
 */

/**
 * Create a user
 *  - check if the user with the email already exists using `User.isEmailTaken()` method
 *  - If so throw an error using the `ApiError` class. Pass two arguments to the constructor,
 *    1. “200 OK status code using `http-status` library
 *    2. An error message, “Email already taken”
 *  - Otherwise, create and return a new User object
 *
 * @param {Object} userBody
 * @returns {Promise<User>}
 * @throws {ApiError}
 *
 * userBody example:
 * {
 *  "name": "crio-users",
 *  "email": "crio-user@gmail.com",
 *  "password": "usersPasswordHashed"
 * }
 *
 * 200 status code on duplicate email - https://stackoverflow.com/a/53144807
 */

// TODO: CRIO_TASK_MODULE_CART - Implement getUserAddressById()
/**
 * Get subset of user's data by id
 * - Should fetch from Mongo only the email and address fields for the user apart from the id
 *
 * @param {ObjectId} id
 * @returns {Promise<User>}
 */
const getUserAddressById = async (id) => {
    console.log(id)
    const address =  await User.findOne({ _id: id }, { email: 1, address: 1 });
  return address;
};

/**
 * Set user's shipping address
 * @param {String} email
 * @returns {String}
 */
const setAddress = async (user, newAddress) => {
  user.address = newAddress;
  await user.save();

  return user.address;
};

module.exports = {getUserById, getUserByEmail, createUser, getUserAddressById, setAddress};


