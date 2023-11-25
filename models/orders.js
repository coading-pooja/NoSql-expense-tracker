const mongoose = require('mongoose');

  const orderSchema = new mongoose.Schema({
    
    paymentid:String,
    orderid:String,
    status:String,
    user: {type: mongoose.Schema.Types.ObjectId, ref:'User'},
    user_id:String,


  });
const Order = mongoose.model('Order', orderSchema)

module.exports = Order;