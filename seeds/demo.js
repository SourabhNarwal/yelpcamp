const mongoose=require('mongoose');

const run =async ()=>{
await mongoose.connect('mongodb://127.0.0.1:27017/yelp-camp');
const db=mongoose.connection;
 db.on('error',console.error.bind(console,'connection error to mongosh'));
 db.once('open',()=>{
    console.log('database connected from seeds');
});
}
run();