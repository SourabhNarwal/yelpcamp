const User=require('../models/user');
module.exports.renderRegisterForm=(req,res)=>{
    res.render('user/register');
}
module.exports.createUser=async(req,res,next)=>{
    try{
        const {email,username,password}=req.body;
    const user=new User({username,email});
    const registeredUser=await User.register(user,password);
    req.login(registeredUser,(err)=>{
        if(err)return next(err);
        req.flash('success','new user registered!!!');
    res.redirect('/campgrounds');
    })
    }
    catch(e)
    {
        req.flash('error',e.message);
        res.redirect('register');
    }
    }
module.exports.renderLoginForm=(req,res)=>{
    res.render('user/login');
}

module.exports.loggedin=async(req,res)=>{
    const username= await req.body.username;
    req.flash('success',`welcome back ${username} !!`);

     const redirectUrl = res.locals.returnTo || '/campgrounds'; 
    delete req.session.returnTo;
    res.redirect(redirectUrl);
}
module.exports.logout=(req,res,next)=>{
    req.logOut(function (err){
         if(err){
           return next(err);
         }
         req.flash('success','you logged out!');
         res.redirect('/campgrounds');
    })
}