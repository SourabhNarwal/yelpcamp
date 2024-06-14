const campground=require('../models/campground');
const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding");
const mapBoxToken = process.env.MAPBOX_TOKEN;
const geocoder = mbxGeocoding({ accessToken: mapBoxToken });
const {cloudinary}=require('../cloudinary');
const { query } = require('express');
module.exports.index=async (req, res) => {
    const campgrounds = await campground.find({});
    res.render('campground/index', { campgrounds });
}

module.exports.renderNewForm= (req, res) => {

    res.render('campground/new');
}

module.exports.createCampground=async (req, res, next) => {
    const geoData=await geocoder.forwardGeocode({
        query:req.body.camps.location,
        limit:1
    }).send();
    const camp = new campground(req.body.camps);
    camp.geometry=geoData.body.features[0].geometry;
     camp.images=req.files.map(f=>({url:f.path,filename:f.filename}));
     camp.author=req.user._id;
     await camp.save();
     req.flash('success','new campground successfuly created!!!')
    res.redirect(`campgrounds/${camp._id}`);
 }

module.exports.showCampground=async (req, res) => {
    const camp = await campground.findById(req.params.id).
    populate({path:'reviews',
       populate:{path:'author'} 
    }).
    populate('author');
    
    if(!camp)
    {
        req.flash('error','OOPS campground not found');
        return res.redirect('/campgrounds');
    }
    res.render('campground/show', { campground: camp });
}

module.exports.renderEditForm=async (req, res) => {
    const camp = await campground.findById(req.params.id);
    if(!camp)
    {
        req.flash('error','OOPS campground not found');
        return res.redirect('/campgrounds');
    }
    
    res.render('campground/edit', { campground: camp });
}

module.exports.updateCampground=async (req, res) => {
    const camp = await campground.findByIdAndUpdate(req.params.id, { ...req.body.camps });
   
    if (req.files.length > 0) {
        const imgs = req.files.map(f => ({url: f.path, filename: f.filename}))
        camp.images.push(...imgs);
    }    
    await camp.save();
    if (req.body.deleteImages) {    
        await campground.updateOne({ $pull: { images: { filename: { $in: req.body.deleteImages } } } })
        for (let filename of req.body.deleteImages) {
            await cloudinary.uploader.destroy(filename);
        }
    }
    req.flash('success',' campground successfuly updated!!!')

    res.redirect(`/campgrounds/${camp._id}`);
}

module.exports.deleteCampground=async (req, res) => {
    const { id } = req.params;
    const camp = await campground.findById(id);
    if(!camp)
    {
        req.flash('error','OOPS campground not found');
        return res.redirect('/campgrounds');
    }
    
    await campground.findByIdAndDelete(id);
    req.flash('success',' campground successfuly deleted!!!')

    res.redirect(`/campgrounds`);
}