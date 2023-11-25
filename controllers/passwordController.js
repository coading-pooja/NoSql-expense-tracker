 const Brevo = require('@getbrevo/brevo')
const {v4:uuidv4} = require('uuid');       
const bcrypt = require('bcrypt'); 
const path = require('path'); 
const mongoose = require('mongoose');     

const fs= require("fs")
     

const Resetpassword = require('../models/password');
const User = require('../models/user');
const { isUtf8 } = require('buffer');

require('dotenv').config();                       //access environment variables
const brevoAPIKey = process.env.BREVO_API_KEY;

//API to send mail for forgot password
const forgotPasswordMail = async(req, res) =>{
    try{
        const user = await User.findOne({email:req.body.email});
        
        if(!user) return res.status(400).json({status:"Fail", message:"Email not found"});

        const uid = uuidv4();
        const resetpassword = await Resetpassword.create({uid, userId: user.id, active:true});
        console.log("active pass link", resetpassword)
         //create a brevo instance
        const defaultClient = await Brevo.ApiClient.instance;
        var apiKey = defaultClient.authentications['api-key']; //isapi-key an argument?
        apiKey.apiKey = brevoAPIKey;
        const transEmailApi = new Brevo.TransactionalEmailsApi();
        await Promise.all([apiKey, transEmailApi]);
         const path = `http://localhost:3000/password/createNewPassword/${uid}`;

      const sender = {
      email: "poojagoyal5106@gmail.com",
      name: "Code pooja",
      };
      const receivers = [req.body];

      await transEmailApi.sendTransacEmail({
      sender,
      to: receivers,
      subject: "Reset Password",
      textContent: "Click here to reset your password",
      htmlContent: `<a href="${path}">Click Here</a> to reset your password!`,
      });

     res .status(200).json({ status: "Success", message: "Password reset email sent successfully!" });
    
    } catch (error) {
       console.error("Error sending password reset link", error)
      }
     
};

const createNewPassword = async(req, res) =>{
  try{
    const createPasswordUUID = await Resetpassword.findOne({uid: req.params.uid})
    if(!createPasswordUUID)return res.status(400).json({status:"failed", message:"Invalid Link"})
    const passwordPath = path.join(__dirname,'..','views', 'password.html');
    res.sendFile(passwordPath);

  }catch(err){
    console.log(err)
  }

}

const postNewPassword = async(req, res) =>{
  const { uid } = req.params;
  const {password, confirmpassword} = req.body;      //can we get that id thru body too?  //is it necessary to check password and confirmpasswords are same here also, already have checked in frontend  
  try{
    const row = await Resetpassword.findOne({uid: uid});
    console.log(row)
    if(!row.active){
      return res.status(400).json({status: "Failed", message: "Expired Link", success:false});
    }

    const hashedPassword = bcrypt.hashSync(password, 10);

    const updatedPassword = Resetpassword.updateOne({active:false},{uid:uid})

    const updatedUser = User.updateOne({password: hashedPassword}, {_id: row.userId})

    await Promise.all([updatedPassword, updatedUser]);
    res.status(200).send({status:"Success", message: "Password updated successfully", success:true});

  }catch(err){
    console.log(err);
  }


}





module.exports = {
  forgotPasswordMail,
  createNewPassword,
 postNewPassword
  
}