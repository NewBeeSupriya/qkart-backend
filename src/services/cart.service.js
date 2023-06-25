const httpStatus = require("http-status");
const { User, Cart, Product } = require("../models");
const ApiError = require("../utils/ApiError");
const config = require("../config/config");


/**
 * Fetches cart for a user 
 * - Fetch user's cart from Mongo
 * - If cart doesn't exist, throw ApiError
 * --- status code  - 404 NOT FOUND
 * --- message - "User does not have a cart"
 *
 * @param {User} user
 * @returns {Promise<Cart>}
 * @throws {ApiError}
 */
const getCartByUser = async (user) => {
  // console.log("from cartservice",user.email)
  let cart = await Cart.findOne({email: user.email})
  // console.log("from service", cart);
  if(!cart){
    throw new ApiError(httpStatus.NOT_FOUND, "User does not have a cart");
  }
  return cart
};

/**
 * Adds a new product to cart
 * - Get user's cart object using "Cart" model's findOne() method
 * --- If it doesn't exist, create one
 * --- If cart creation fails, throw ApiError with "500 Internal Server Error" status code
 *
 * - If product to add already in user's cart, throw ApiError with
 * --- status code  - 400 BAD REQUEST
 * --- message - "Product already in cart. Use the cart sidebar to update or remove product from cart"
 *
 * - If product to add not in "products" collection in MongoDB, throw ApiError with
 * --- status code  - 400 BAD REQUEST
 * --- message - "Product doesn't exist in database"
 *
 * - Otherwise, add product to user's cart
 *
 *
 *
 * @param {User} user
 * @param {string} productId
 * @param {number} quantity
 * @returns {Promise<Cart>}
 * @throws {ApiError}
 */
const addProductToCart = async (user, productId, quantity) => {
  // let cart = await Cart.findOne({email: user.email})
  
  // if(!cart){ 
  //   try {
  //     cart = Cart.create({
  //       email: user.email,
  //       cartItems: [], 
  //     paymentOption: config.default_payment_option,
  //     })
  //     await cart.save()
  //     // return cart;
  //   } catch (error) {
  //   throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, "Failed to create the cart")
      
  //   }
     
  // }
  // // console.log("from addProd", cart)
  // // if(cart==null){
  // //   throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, "User does not have a Cart")
  // // }

  // // let productIndex = -1;

  // // for(let i=0; i<cart.cartItems.length; i++){
  // //   if(productId == cart.cartItems[i].product._id){
  // //     productIndex = i
  // //     break;
  // //   }
  // // }

  // let check = cart.cartItems.some((item)=> item.product._id === productId)
  // if(check){
  //   throw new ApiError(httpStatus.BAD_REQUEST, "Product already in cart. Use the cart sidebar to update or remove product from cart")
  // }

  // // if(productIndex == -1){
  //   let product = await Product.findOne({_id: productId})

  //   if(product == null){
  //   throw new ApiError(httpStatus.BAD_REQUEST, "Product doesn't exist in database")
  //   }

  //   cart.cartItems.push({product, quantity})

  // // }else{
  // //   throw new ApiError(httpStatus.BAD_REQUEST, "Product already in cart. Use the cart sidebar to update or remove product from cart")
  // // }
  // await cart.save()
  // return cart;
  let cart = await Cart.findOne({email:user.email});

  if (!cart){
    try{
       cart = await Cart.create({
        email:user.email,
        cartItems:[],
        paymentOption:config.default_payment_option,
        });
        await cart.save();
    }catch(e){
      throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR,"User cart creation failed");
    }
  }


if(cart.cartItems.some((item)=>item.product._id == productId))
{
  throw new ApiError(httpStatus.BAD_REQUEST,"Product already in cart. Use the cart sidebar to update or remove product from cart")
}

const product = await Product.findOne({_id:productId})
if(!product){
  throw new ApiError(httpStatus.BAD_REQUEST,"product doesn't exist in the database")
}

cart.cartItems.push({ product,quantity})
await cart.save();

return cart;
};

/**
 * Updates the quantity of an already existing product in cart
 * - Get user's cart object using "Cart" model's findOne() method
 * - If cart doesn't exist, throw ApiError with
 * --- status code  - 400 BAD REQUEST
 * --- message - "User does not have a cart. Use POST to create cart and add a product"
 *
 * - If product to add not in "products" collection in MongoDB, throw ApiError with
 * --- status code  - 400 BAD REQUEST
 * --- message - "Product doesn't exist in database"
 *
 * - If product to update not in user's cart, throw ApiError with
 * --- status code  - 400 BAD REQUEST
 * --- message - "Product not in cart"
 *
 * - Otherwise, update the product's quantity in user's cart to the new quantity provided and return the cart object
 *
 *
 * @param {User} user
 * @param {string} productId
 * @param {number} quantity
 * @returns {Promise<Cart}
 * @throws {ApiError}
 */
const updateProductInCart = async (user, productId, quantity) => {
  let cart = await Cart.findOne({email: user.email})

  if(!cart){
    throw new ApiError(httpStatus.BAD_REQUEST, "User does not have a cart. Use POST to create cart and add a product")
  }

  let product = await Product.findOne({_id: productId})

  if(!product){
    throw new ApiError(httpStatus.BAD_REQUEST, "Product doesn't exist in database")
  }

  let productIndex = -1
  for(let i=0; i<cart.cartItems.length; i++){
    if(productId == cart.cartItems[i].product._id){
      productIndex = i
      // break;
    }
  }

  if(productIndex == -1){
    throw new ApiError(httpStatus.BAD_REQUEST, "Product not in cart")
  }else{
    cart.cartItems[productIndex].quantity = quantity
  }

  await cart.save()
  return cart;
};

/**
 * Deletes an already existing product in cart
 * - If cart doesn't exist for user, throw ApiError with
 * --- status code  - 400 BAD REQUEST
 * --- message - "User does not have a cart"
 *
 * - If product to update not in user's cart, throw ApiError with
 * --- status code  - 400 BAD REQUEST
 * --- message - "Product not in cart"
 *
 * Otherwise, remove the product from user's cart
 *
 *
 * @param {User} user
 * @param {string} productId
 * @throws {ApiError}
 */
const deleteProductFromCart = async (user, productId) => {
  let cart = await Cart.findOne({email: user.email})

  if(!cart){
    throw new ApiError(httpStatus.BAD_REQUEST, "User does not have a cart")
  }

  let product = await Product.findOne({_id: productId})

  let productIndex = -1
  for(let i=0; i<cart.cartItems.length; i++){
    if(productId== cart.cartItems[i].product._id){
      productIndex = i
    }
  }

  if(productIndex == -1){
    throw new ApiError(httpStatus.BAD_REQUEST, "Product not in cart")
  }else{
    cart.cartItems.splice(productIndex, 1)
  }

  await cart.save()
};

// };

// TODO: CRIO_TASK_MODULE_TEST - Implement checkout function
/**
 * Checkout a users cart.
 * On success, users cart must have no products.
 *
 * @param {User} user
 * @returns {Promise}
 * @throws {ApiError} when cart is invalid
 */
const checkout = async (user) => {
  let cart = await Cart.findOne({email: user.email})

  if(cart == null){
    throw new ApiError(httpStatus.NOT_FOUND, "User does not have a cart")
  }

  if(!cart.cartItems.length){
    throw new ApiError(httpStatus.BAD_REQUEST, "Cart is Empty")
  }

  let check = await user.hasSetNonDefaultAddress()
  if(!check){
    throw new ApiError(httpStatus.BAD_REQUEST, "Address is not set")
  }

  let total= 0;
  cart.cartItems.some((item)=>{
    total = item.product.cost * item.quantity
  })
  if(user.walletMoney < total){
    throw new ApiError(httpStatus.BAD_REQUEST, "Wallet balance is insufficient")
  }
  user.walletMoney= user.walletMoney-total;
  cart.cartItems = []
  user.save()
  cart.save()
  
};

module.exports = {
  getCartByUser,
  addProductToCart,
  updateProductInCart,
  deleteProductFromCart,
  checkout,
};
