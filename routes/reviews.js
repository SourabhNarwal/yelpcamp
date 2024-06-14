const express = require('express');
const router = express.Router({mergeParams:true});
const catchAsync=require('../utils/catchAsync');
const reviewController=require('../controllers/reviews');
const {validateReview,isLoggedin,isReviewAuthor}=require('../middlewares');



router.post('/',isLoggedin,validateReview,catchAsync(reviewController.createReview))
router.delete('/:reviewid',isLoggedin,isReviewAuthor,catchAsync(reviewController.deleteReview))

  module.exports=router;