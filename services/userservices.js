const Expense=require('../models/expenses')


const getExpenses = (req,where)=>{
    return Expense.find({userId:req.user._id});
}


module.exports = {
    getExpenses
}