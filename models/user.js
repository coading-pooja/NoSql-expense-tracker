const mongoose= require('mongoose'); //table


const userSchema =new mongoose.Schema({
    name: String,
    email: String,
    password: String,
    ispremiumuser:  {type: Boolean, default: false},
    total: {type: Number, default: 0}

    }, 
    { timestamps: false} //disables createdat and updatedat
)

const User = mongoose.model('User', userSchema)

module.exports = User;
