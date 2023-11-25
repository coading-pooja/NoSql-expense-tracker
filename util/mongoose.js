const mongoose = require('mongoose'); 
require('dotenv').config();

const connectToMongoDB = async ()=>{
    try{
    return await mongoose.connect(process.env.MONGO_URL)
}catch(err){
    console.log(err)
}
}

module.exports = {
    connectToMongoDB
};
































































