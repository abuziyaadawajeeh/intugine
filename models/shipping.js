const mongoose = require("mongoose");
const auto_increment = require('mongoose-plugin-autoinc');

const shipping_schema = new mongoose.Schema({
    address : {
        type : String, 
        required : true
    },
    city : {
        type : String, 
        required : true
    },
    pincode : {
        type : String,
        required : true
    },
    order : {
        type : Number,
        ref : "Order" , 
        required : true 
    } , 
    customer : {
        type : Number , 
        ref : "Customer" ,
        required : true
    }
})

// use plugin to increment _id field automatically on create

shipping_schema.plugin(auto_increment.plugin , 'Shipping')

module.exports = order = mongoose.model("Shipping", shipping_schema)