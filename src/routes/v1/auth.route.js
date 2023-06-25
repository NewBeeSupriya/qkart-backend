const express = require("express");
const validate = require("../../middlewares/validate");
const authValidation = require("../../validations/auth.validation");
const authController = require("../../controllers/auth.controller");

const router = express.Router(); 

// TODO: CRIO_TASK_MODULE_AUTH - Implement "/v1/auth/register" and "/v1/auth/login" routes with request validation
const validateUserReg = validate(authValidation.register);
const validateUserlog = validate(authValidation.login);
router.post("/register",validateUserReg, authController.register); 
router.post("/login",validateUserlog, authController.login); 

  
module.exports = router;
 
