const mongoose = require("mongoose")
const config = require("config")
const mongodb = config.get("mongodbURI")

module.exports = async () => {
    try {
        await mongoose.connect(mongodb, {useNewUrlParser : true, useUnifiedTopology : true})
        console.log("Successfully connected to DB")
    } catch (error) {
        console.log("Connection to Db Failed")
        console.log(error.message)
    }
}


