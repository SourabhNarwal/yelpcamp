const express=require('express');
const router=express.Router();
const userController=require('../controllers/user')
const passport = require('passport');
const catchAsync = require('../utils/catchAsync');
const { storeReturnTo } = require('../middlewares');

router.route('/register')
      .get(userController.renderRegisterForm)
      .post(catchAsync(userController.createUser))

router.route('/login')      
      .get(userController.renderLoginForm)
      .post(storeReturnTo,passport.authenticate('local',{failureFlash:true,failureRedirect:'/login'}),
             userController.loggedin)

router.get('/logout',userController.logout)
module.exports=router;