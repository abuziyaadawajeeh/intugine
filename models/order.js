const mongoose = require("mongoose");
const auto_increment = require('mongoose-plugin-autoinc');

const order_schema = new mongoose.Schema({
    product_name : {
        type : String, 
        required : true
    },
    quantity : {
        type : Number, 
        required : true
    },
    price : {
        type : Number,
        required : true
    },
    mrp : {
        type : Number,
        required : true
    } , 
    customer : {
        type : Number , 
        required : true,
        ref : "Customer"
    }
})

// use plugin to increment _id field automatically on create

order_schema.plugin(auto_increment.plugin , 'Order')

module.exports = order = mongoose.model("Order", order_schema)