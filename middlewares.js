const {campgroundSchema,reviewSchema}=require('./schemas');
const ExpressError=require('./utils/ExpressError');
const campground=require('./models/campground');
const Review=require('./models/review');
module.exports.isLoggedin=(req,res,next)=>{
    if(!req.isAuthenticated())
        {  req.session.returnTo=req.originalUrl;
             req.flash('error','not logged in!!!!!!');
           return res.redirect('/login')
        }
        next();
}

module.exports.storeReturnTo=(req,res,next)=>{
    if(req.session.returnTo)
        {
            res.locals.returnTo=req.session.returnTo;
        }
        next();
}

module.exports.validateCampground=(req,res,next)=>{
    const {error}=campgroundSchema.validate(req.body);
    if(error)
    {
        const msg=error.details.map(el=>el.message).join(',');
        throw new ExpressError(msg,400);
    }
    next();
}
module.exports.isAuthor=async(req,res,next)=>{
    const camp = await campground.findById(req.params.id);
    if(!camp.author.equals(req.user._id))
        {
            req.flash('error','you do not have permii to make changes :(');
            return res.redirect(`/campgrounds/${camp._id}`);
        }
        next();
}

module.exports.isReviewAuthor=async(req,res,next)=>{
    const {id,reviewid} = await req.params;
    const review=await Review.findById(reviewid); 
 
    if(!review.author.equals(req.user._id))
        {
            req.flash('error','you do not have permii to make changes :(');
            return res.redirect(`/campgrounds/${id}`);
        }
        next();
}

module.exports.validateReview=(req,res,next)=>{
    const {error}=reviewSchema.validate(req.body);
    if(error)
    {
        const msg=error.details.map(el=>el.message).join(',');
        throw new ExpressError(msg,400);
    }
    next();
}