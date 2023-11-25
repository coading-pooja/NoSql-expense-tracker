const User = require('../models/user');
const Expense = require('../models/expenses');
// const sequelize = require('../util/database');
const mongoose = require('mongoose');


const getUserLeaderboard = async(req, res)=>{
    try{


      if(!req.user.ispremiumuser){
        return res.status(400).json({success:false})
      }
        //we have to send aggregate expenses of each user to showLeaderboard route
        // const users = await User.findAll();
        // const expenses = await Expense.findAll();
        // const userAggregatedExpenses = {}; //an object that will stro the all the expense of respectibe userIds as key value pairs
        
        // console.log(expenses)

        // expenses.forEach(expense=>{
        //     if(userAggregatedExpenses[expense.userId]){
        //         userAggregatedExpenses[expense.userId] += expense.amount;
        //     }else{
        //         userAggregatedExpenses[expense.userId] = expense.amount;
        //     }
        // })
        // console.log("userAggregatedExpenses>>>>>>>>",userAggregatedExpenses);
        // var userLeaderboardDetails = [];
        // users.forEach(user =>{
        //     if(userAggregatedExpenses[user.id]==undefined){ // for those user who have not added any expense
        //         userLeaderboardDetails.push({name: user.name, total: 0});
        //     }
        //     else{
        //         userLeaderboardDetails.push({name: user.name, total: userAggregatedExpenses[user.id]});
        //     }
        // })
        // userLeaderboardDetails.sort((a,b)=> a.total-b.total )
        // console.log(userLeaderboardDetails);
        // res.status(200).json(userLeaderboardDetails);
        const leaderboardData = await User.find();
        res.status(200).json(leaderboardData);


        }catch (err) {
        console.error(err);
      }
}

module.exports ={
     getUserLeaderboard
}
