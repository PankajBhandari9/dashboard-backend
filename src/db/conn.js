const mongoose=require('mongoose');

mongoose.connect("mongodb://localhost:27017/E-commerce")
    .then(()=>console.log("E-commerce database connected"))
    .catch((err)=>console.log("Error connecting E-commerce database"));