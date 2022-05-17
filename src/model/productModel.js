const mongoose=require("mongoose");

const productSchema=new mongoose.Schema({
    productName:String,
    productPrice:Number,
    productCatagory:String,
    userId:String,
    productCompany:String
});

const productModel=mongoose.model("product",productSchema);

module.exports=productModel;