const mongoose = require('mongoose');


const resetpasswordSchema = new mongoose.Schema({
    uid: String,
    userId: String,
    active: Boolean,
    expireby: Date

})

const Resetpassword = mongoose.model('Resetpassword', resetpasswordSchema)

module.exports = Resetpassword;