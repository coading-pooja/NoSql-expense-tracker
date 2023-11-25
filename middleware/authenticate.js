const jwt = require('jsonwebtoken');
const User = require('../models/user');
require('dotenv').config();

require('dotenv').config();
// this is a middleware that we have created to check who the user is. 
const authenticate = async(req,res,next) =>{
    try{
        const token = req.header('Authorization');
        //console.log(token);
        //console.log(process.env.SECRET_KEY);
        const data = jwt.verify(token, process.env.secretKey); //decrpting the secret key
        //  console.log(data.userId);
    
         const user = await User.find({_id:data.userId})
         req.user = user[0];
        //  console.log(req.user)
         next();
  // we are attaching the user object to the request so that the next middle ware that  is the controller middle ware of expense will be able to know that whose expense to show in UI. 
                
                
    }
    catch(err){
        console.log(err);
        res.status(401);
    }
}

module.exports = {
    authenticate
}