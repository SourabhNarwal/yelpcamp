
if (process.env.NODE_ENV !== "production") {
    require('dotenv').config();
}

const express=require('express');
const app=express();
const path=require('path');
const session=require('express-session');
const ExpressError=require('./utils/ExpressError');
const flash=require('connect-flash');
const isLoggedin=require('./middlewares');
const methodOverride=require('method-override');
const ejsMate=require('ejs-mate');

const userRoutes=require('./routes/user');
const campgroundsRoutes=require('./routes/campgrounds');
const reviewsRoutes=require('./routes/reviews');
const User=require('./models/user');

const passport=require('passport');
const LocalStrategy = require('passport-local');
const mongoSanitize = require('express-mongo-sanitize');
const helmet = require('helmet');

const mongoose=require('mongoose');
const { name } = require('ejs');
const dbUrl = process.env.DB_URL || 'mongodb://localhost:27017/yelp-camp';


const MongoStore = require('connect-mongo');
// process.env.DB_URL
// 'mongodb://127.0.0.1:27017/yelp-camp'
mongoose.connect(dbUrl)
const db=mongoose.connection;
db.on('error',console.error.bind(console,'connection error to mongosh'));
db.once('open',()=>{
    console.log('database connected through app.js');
});


app.engine('ejs',ejsMate);
app.set('view engine','ejs');
app.set('views',path.join(__dirname,'views'));

console.log('WELCOME! MADE BY SOURABH_NARWAL');
app.use(express.urlencoded({extended:true}));
app.use(methodOverride('_method'));

const secret = process.env.SECRET || 'thisshouldbeabettersecret!';
const store = MongoStore.create({
    mongoUrl: dbUrl,
    touchAfter: 24 * 60 * 60,
    crypto: {
        secret
    }
});

sessionConfig={
    store,
    name:'session',
    secret,
    resave:false,
    saveUninitialized:true,
    cookie:{
        expires:Date.now()+1000*60*60*24*7,
        maxage:1000*60*60*24*7,
        httpOnly:true
    }
}
app.use(session(sessionConfig))
app.use(flash())

app.use(helmet());

const scriptSrcUrls = [
    "https://stackpath.bootstrapcdn.com/",
    "https://api.tiles.mapbox.com/",
    "https://api.mapbox.com/mapbox-gl-js/v1.12.0/mapbox-gl.js",
    "https://kit.fontawesome.com/",
    "https://cdnjs.cloudflare.com/",
    "https://cdn.jsdelivr.net",
];
const styleSrcUrls = [
    "https://kit-free.fontawesome.com/",
    "https://stackpath.bootstrapcdn.com",
    "https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css",
    "https://api.mapbox.com/mapbox-gl-js/v1.12.0/mapbox-gl.css",
    "https://api.tiles.mapbox.com/",
    "https://fonts.googleapis.com/",
    "https://use.fontawesome.com/",
];
const connectSrcUrls = [
    "https://api.mapbox.com/",
    "https://a.tiles.mapbox.com/",
    "https://b.tiles.mapbox.com/",
    "https://events.mapbox.com/",
];
const fontSrcUrls = [];
app.use(
    helmet.contentSecurityPolicy({
        directives: {
            defaultSrc: [],
            connectSrc: ["'self'", ...connectSrcUrls],
            scriptSrc: ["'unsafe-inline'", "'self'", ...scriptSrcUrls],
            styleSrc: ["'self'", "'unsafe-inline'", ...styleSrcUrls],
            workerSrc: ["'self'", "blob:"],
            objectSrc: [],
            imgSrc: [
                "'self'",
                "blob:",
                "data:",
                "https://res.cloudinary.com/dwyggueee/", //SHOULD MATCH YOUR CLOUDINARY ACCOUNT! 
                "https://images.unsplash.com/",
            ],
            fontSrc: ["'self'", ...fontSrcUrls],
        },
    })
);


app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));


passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
app.use(express.static(path.join(__dirname,'public')));
app.use(mongoSanitize({
    replaceWith: '_'
}))


app.use((req,res,next)=>{
    console.log(req.query);
    res.locals.currentuser=req.user;
    res.locals.success=req.flash('success');
    res.locals.error=req.flash('error');
    next();
})



app.use('/',userRoutes);

app.use('/campgrounds',campgroundsRoutes);
app.use('/campgrounds/:id/reviews',reviewsRoutes);

app.get('/',(req,res)=>{
    res.render('home');
})

app.all('*',(req,res,next)=>{
    next(new ExpressError('page not found',404));
})

app.use((err,req,res,next)=>{
    const {statusCode=500}=err;
    if(!err.message) err.message='something went wrong';
    res.status(statusCode).render('error',{err});
})

const port = process.env.PORT || 3030;
app.listen(port, () => {
    console.log(`Serving on port ${port}`)
})

