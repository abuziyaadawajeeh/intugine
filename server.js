const express = require("express")
const app = express()
const connectDB = require("./config/connect")

const PORT = process.env.PORT || 3000

app.get("/", (req,res) => {
    res.send("Server is running")
})

connectDB()

app.use(express.json())


// Add headers
// app.use(function (req, res, next) {
    
//     // Website you wish to allow to connect
//     res.setHeader('Access-Control-Allow-Origin', 'http://localhost:4200');
    
//     // Request methods you wish to allow
//     res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    
//     // Request headers you wish to allow
//     res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    
//     // // Set to true if you need the website to include cookies in the requests sent
//     // // to the API (e.g. in case you use sessions)
//     // res.setHeader('Access-Control-Allow-Credentials', true);
    
//     // Pass to next layer of middleware
//     next();
// });

app.use("/customers", require("./routes/customer"));
app.use("/orders" , require("./routes/order"))
app.use("/shipping" , require("./routes/shipping"))




app.listen(PORT, () => console.log(`Listening on PORT${PORT}`))