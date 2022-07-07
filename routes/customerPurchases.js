const express = require("express")
const router = express.Router()
const Customer = require("../models/customer")
const Order = require("../models/order")
const {body, param, validationResult} = require("express-validator")

router.get(
    "",
    async (req ,res) => {

        try {

            const customers = await Customer.find({} , "", {lean : true} )

            const customer_ids = customers.map(c => c._id)

            const customers_map = {}
            
            customers.forEach(customer => {
                customers_map[customer._id] = {...customer , purchaseOrders : []}
            })
            
            const orders = await Order.find({customer : {$in : customer_ids}} , "" ,{lean : true})

            orders.forEach(order => {
                customers_map[order.customer].purchaseOrders.push(order)
            })

           res.status(200).json(Object.values(customers_map))

            
        } catch (error) {
            console.error(error)
            res.status(500).send("Could not fetch customers and purchases")
        }

    }
)


module.exports = router