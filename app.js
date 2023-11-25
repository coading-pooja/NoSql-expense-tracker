const express = require('express');
const app = express();
// const helmet = require('helmet');
const compression = require('compression');
const morgan = require('morgan');
const fs = require('fs');
const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config();




//import models and database
// const sequelize = require('./util/database');
const {connectToMongoDB} = require('./util/mongoose')
const User = require('./models/user');
const Expense = require('./models/expenses');
const Order = require('./models/orders');
const Password = require('./models/password');

//import routes
const userRoutes = require('./routes/userRoutes');
const expenseRoutes = require('./routes/expenseRoutes');
const purchaseRoutes = require('./routes/purchaseRoutes');
const premiumRoutes = require('./routes/premiumRoutes');
const passwordRoutes = require('./routes/passwordRoutes');

// Enable CORS
app.use(cors());



const errorLogStream = fs.createWriteStream(path.join(__dirname, 'error.log'), { flags: 'a' });

// Use morgan for logging
app.use(
  morgan('combined', {
    stream: errorLogStream,
    skip: (req, res) => res.statusCode < 400, // Only log errors (status code 4xx and 5xx)
  })
);

// app.use(helmet()); // Enable secure headers
app.use(compression()); // Enable compression

app.use(bodyParser.json());
app.use(express.json()); // Parse JSON request bodies

 app.use(express.static("views"))
// Routes directs
app.use('/user', userRoutes);
app.use('/expense', expenseRoutes);
app.use('/purchase', purchaseRoutes);
app.use('/premium', premiumRoutes);
app.use('/password', passwordRoutes);


// Set up model relations
// User.hasMany(Expense);
// Expense.belongsTo(User);
// User.hasMany(Order);
// Order.belongsTo(User);
// User.hasMany(Password);
// Password.belongsTo(User);


// Start the server
const port = process.env.PORT || 3000;
connectToMongoDB().then(()=>{       
  app.listen(port, ()=>{
  console.log(`${port} port Server running`);
 })
 }).catch((err)=>{
         console.error('DB connection error', err)
 })
 