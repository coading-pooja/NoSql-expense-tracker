const express = require("express");
const User = require("../models/user");
const routes = express.Router();
const path = require("path");
const bodyParser = require("body-parser");
const Expense = require("../models/expenses");
const AWS = require("aws-sdk");
const { createSecretKey } = require("crypto");
const UserServices = require("../services/userservices");
const S3Service = require("../services/S3services");

const downloadexpense = async (req, res) => {
  try {
    const expenses = await UserServices.getExpenses(req);
    const stringifiedExpenses = JSON.stringify(expenses);
    const filename = `expense${req.user.id}${new Date()}.txt`;
    const fileUrl = await S3Service.uploadToS3(stringifiedExpenses, filename);

    res
      .status(200)
      .json({ fileUrl: fileUrl, success: true, filename: filename });
  } catch (err) {
    console.log("Error downloading expenses file", err);
    res.status(500).json({ error: "Error downloading expenses" });
  }
};

const addexpense = async (req, res) => {
  try {
    console.log(req.body);
    const amount = req.body.amount;
    const desc = req.body.description;
    const cat = req.body.category;
    const userId = req.user._id;
    // console.log(req.user._id);

    const expense = await Expense.create({
      amount: amount,
      description: desc,
      category: cat,
      userId: userId,
    });
    //  res.status(201).json({ data: expense });
    //  const expense = await Expense.create({ amountExp: amount, description: desc, category: cat, userId:req.user.id });
    // const user = await User.findOne({ _id: req.user._id });
    console.log(req.user);


    console.log('total',req.user.total)
    let newTotalExpense = Number(req.user.total)+Number(amount);
    // // console.log(typeof newTotalExpense);
    // if (user.total === null || user.total<=0 || !user.total) {
    //   newTotalExpense = amount;
    // } else {
    //   newTotalExpense = 
    //   Number(user.total) + Number(amount);
    // }
    await User.updateOne({ _id: userId }, { total: newTotalExpense});
    console.log('total',req.user.total)
    // console.log(newTotalExpense,'added price',user.total);
    res.status(201).json({ data: expense, totalExpenseData: newTotalExpense });
  } catch (err) {
    console.log(err);
  }
};

const deleteexpense = async (req, res) => {
  try {
    // console.log("user", req.user);
    // console.log("asdfgh", req);

    // console.log(req.user.id);
    const oldExpense = await Expense.findOne({ _id: req.body.id });
    await Expense.deleteOne({
      _id: req.body.id,
    });
    // changing the totalExpense data in the user table
    console.log(req.user);

    // Find the user by primary key and update the total
    const user = await User.findOne({ _id: req.user._id });
    console.log(oldExpense, user);
    if (user) {
      const newTotalExpense = Number(user.total) - Number(oldExpense.amount);
      // console.log(user.total);
      // console.log(req.body.amount);
      // console.log(newTotalExpense);

      // Update the user's total
      await User.updateOne({ _id: req.user._id }, { total: newTotalExpense });

      console.log("expense deleted");
      res.sendStatus(204);
    } else {
      // Handle the case where the user with the given ID was not found
      console.log("User not found");
      res.sendStatus(404);
    }
  } catch (err) {
    console.log(err);
    res.sendStatus(500); // Handle other errors accordingly
  }
};

const getexpenses = async (req, res) => {
  try {
    console.log("geetting expense")
    const allExpense = await Expense.find({ userId: req.user._id });
    // console.log(allExpense);
    res.status(200).json({ allExpense: allExpense });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports = {
  addexpense,
  deleteexpense,
  getexpenses,
  downloadexpense,
};
