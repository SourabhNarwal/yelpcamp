 const express = require('express');
 const router = express.Router();
 const catchAsync=require('../utils/catchAsync');
 const campgroundController=require('../controllers/campground');
 const { isLoggedin,isAuthor,validateCampground } = require('../middlewares');
 const multer=require('multer');
 const { storage }=require('../cloudinary');
 const upload=multer({ storage });


router.route('/')
      .get(catchAsync(campgroundController.index))
      .post(isLoggedin,upload.array('image'), validateCampground, catchAsync(campgroundController.createCampground))
      
router.get('/new',isLoggedin,campgroundController.renderNewForm)

router.route('/:id')
      .get( catchAsync(campgroundController.showCampground))
      .put(isLoggedin,isAuthor, upload.array('image'),validateCampground, catchAsync(campgroundController.updateCampground))
      .delete(isLoggedin,isAuthor, catchAsync(campgroundController.deleteCampground))

router.get('/:id/edit',isLoggedin,isAuthor, catchAsync(campgroundController.renderEditForm))




module.exports=router;