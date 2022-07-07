const express = require("express")
const router = express.Router()
const Customer = require("../models/customer")
const Order = require("../models/order")
const Shipping = require("../models/shipping")
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

            const order_ids = orders.map(o => o._id)

            const orders_map = {}

            orders.forEach(order => {
                orders_map[order._id] = {...order , shipping_address : {}}
            })

            const shipping_addresses = await Shipping.find({order : {$in : order_ids}} , "" , {lean : true})

            shipping_addresses.forEach(ship_address => {
                orders_map[ship_address.order].shipping_address = ship_address
            })

            Object.values(orders_map).forEach(order => {
                customers_map[order.customer].purchaseOrders.push(order)
            })

           res.status(200).json(Object.values(customers_map))

            
        } catch (error) {
            console.error(error)
            res.status(500).send("Could not fetch customers , purchases and shipping addresses")
        }

    }
)


module.exports = router