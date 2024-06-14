
const campground=require('../models/campground');
const cities=require('./cities');
const {places,descriptors}=require('./seedhelper'); 
const mongoose=require('mongoose');


 mongoose.connect('mongodb://127.0.0.1:27017/yelp-camp');
const db=mongoose.connection;
 db.on('error',console.error.bind(console,'connection error to mongosh'));
 db.once('open',()=>{
    console.log('database connected from seeds');
});

const sample=array=>array[Math.floor(Math.random()*array.length)];
const seeddb=async()=>{ 
    await campground.deleteMany({});
   
     for(let i=0;i<200;i++){
       const random1000=Math.floor(Math.random()*1000);
       
       const cost=Math.floor(Math.random()*20)+100;
       const camp=new campground({
         location:`${cities[random1000].city},${cities[random1000].state}`,
         title:`${sample(descriptors)} ${sample(places)}`,
         description:`Lorem ipsum dolor sit amet consectetur adipisicing elit. A vitae dignissimos veritatis tenetur aperiam laudantium fugit quos deserunt, ipsam non animi iste dicta incidunt amet officiis aspernatur quaerat magnam voluptatibus.`,
         geometry: {
          type: "Point",
          coordinates: [cities[random1000].longitude, cities[random1000].latitude]
      },
         images:  [
          {
            url: 'https://res.cloudinary.com/dwyggueee/image/upload/v1717993309/YelpCamp/iytznxeytwnyje0lo1hi.jpg',
            filename: 'YelpCamp/iytznxeytwnyje0lo1hi',
        
          }
        ],
    
         author:'66490380db3791c707ae124b',
         price:cost
       })
    
      await camp.save();
   
}
}

seeddb().then(()=>{
    mongoose.connection.close();
})