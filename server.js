const express = require("express")
const app = express()
const connectDB = require("./config/connect")

const PORT = process.env.PORT || 3000

app.get("/", (req,res) => {
    res.send("Server is running")
})

connectDB()

app.use(express.json())


app.use("/customers", require("./routes/customer"));
app.use("/customersInCity" , require("./routes/customersInCity"))
app.use("/customerPurchases" , require("./routes/customerPurchases"))
app.use("/customerPurchaseShippings" , require("./routes/customerPurchaseShippings"))
app.use("/orders" , require("./routes/order"))
app.use("/shipping" , require("./routes/shipping"))




app.listen(PORT, () => console.log(`Listening on PORT${PORT}`))