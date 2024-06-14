const Review=require('../models/review');
const campground=require('../models/campground');

module.exports.createReview=async(req,res)=>{
    const camp=await campground.findById(req.params.id);
    const review= new Review( req.body.review);
    review.author=req.user._id;
    camp.reviews.push(review);
    await review.save();
    await camp.save();
    req.flash('success','new review successfuly created!!!')

    res.redirect(`/campgrounds/${camp._id}`);
   
  }
module.exports.deleteReview=async(req,res)=>{
    const {id,reviewid}=req.params;
    await campground.findByIdAndUpdate(id,{$pull:{reviews:reviewid}});
    await Review.findByIdAndDelete(reviewid);
    req.flash('success','review successfuly deleted!!!')

    res.redirect(`/campgrounds/${id}`);
}  