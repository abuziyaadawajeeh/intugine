const mongoose = require("mongoose")
const auto_increment = require('mongoose-plugin-autoinc');


const customer_schema = new mongoose.Schema({
    name : {
        type : String, 
        required : true
    }, 
   email : {
        type : String , 
        required : true, 
   } ,
   mobile : {
        type : String , 
        required : true , 
   } ,
   city : {
        type : String , 
        required : true
   }
})

// use plugin to increment _id field automatically on create

customer_schema.plugin(auto_increment.plugin , 'Customer')

module.exports = Customer = mongoose.model("Customer", customer_schema)