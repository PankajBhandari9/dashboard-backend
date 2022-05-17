const mongoose=require("mongoose");

// create schema
const userSchema=new mongoose.Schema({
    name:String,
    email:String,
    password:String,
});

// create model
const userModel=mongoose.model("user",userSchema);

// export user
module.exports=userModel;