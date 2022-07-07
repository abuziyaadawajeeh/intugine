const express = require("express")
const router = express.Router()
const Customer = require("../models/customer")
const Shipping = require("../models/shipping")
const {body, param, validationResult} = require("express-validator")

router.get(
    "/:city",
    [
        param("city" , "Provide a City Name").isString().not().isEmpty()
    ] ,
    async (req ,res) => {

        const errors = validationResult(req)
        if(!errors.isEmpty())
            return res.status(400).json({msg : errors.array()})

        const city = req.params.city 

        try {

            const customers_in_city = await Customer.find({city} , "", {lean : true} )

            const customer_ids = customers_in_city.map(c => c._id)

            const customers_map = {}

            
            customers_in_city.forEach(customer => {
                customers_map[customer._id] = {...customer , shipping_addresses : []}
            })
            
            const shipping_addresses = await Shipping.find({customer : {$in : customer_ids}} , "" ,{lean : true})

            shipping_addresses.forEach(address => {
                customers_map[address.customer].shipping_addresses.push(address)
            })

           res.status(200).json(Object.values(customers_map))

            
        } catch (error) {
            console.error(error)
            res.status(500).send("Could not fetch customers in City")
        }

    }
)


module.exports = router