const express = require("express")
const router = express.Router()
const Customer = require("../models/customer")
const Order = require("../models/order")
const {body, param, validationResult} = require("express-validator")

router.post(
    "/",
    [
        body("product_name", "Provide a Product Name!").not().isEmpty(),
        body("quantity", "Provide a Quantity(number)!").isInt() , 
        body("price" , "Provide a Price(number)").isInt(),
        body("mrp" , "Provide a MRP(number) >= Price").isInt().custom((value , {req}) => value >= req.body.price ) ,
        body("customer" , "Provide a Valid Customer ID (number)").isInt()
    ],
    async (req,res) =>{

        const errors = validationResult(req)
        if(!errors.isEmpty())
            return res.status(400).json({msg : errors.array()})
        

        const new_order = new Order(req.body)

        try {

            await new_order.save()
            res.status(200).send(new_order._doc)

        } catch (error) {

            console.log(error)
            res.status(500).send("Server Error . Could not create Order")
        }
        
    }
)

router.get(
    "/", 
    async ( req , res) => {

        try {
            const orders = await Order.find({})
            res.status(200).json(orders)
        } catch (error) {
            console.error(error)
            res.status(500).send('Could not fetch Orders')
        }

        
    }
)

router.get(
    "/:id", 
    [
        param("id" , "Invalid Order Id . Enter a Number").isInt()
    ] ,
    async ( req , res) => {
        const errors = validationResult(req)
        
        if(!errors.isEmpty())
            res.status(400).json({msg : errors.array()})

        const id = req.params.id

        try {
            const order = await Order.findById(id)
            if(!order)
                res.status(404).send(`No Order exists with the given Id : ${id} `)
            else
                res.status(200).json(order)

        } catch (error) {
            console.error(error)
            res.status(500).send('Could not fetch Order')
        }

        
    }
)

router.put(
    "/:id",
    [
        param("id" , "Invalid Order Id . It should be a Number").isInt(),
        body("product_name", "Provide a Product Name!").not().isEmpty(),
        body("quantity", "Provide a Quantity(number)!").isInt() , 
        body("price" , "Provide a Price(number)").isInt(),
        body("mrp" , "Provide a MRP(number) >= Price").isInt().custom((value , {req}) => value >= req.body.price )  ,
        body("customer" , "Provide a Valid Customer ID (number)").isInt()
    ],
    async (req,res) =>{
        const errors = validationResult(req)
        if(!errors.isEmpty())
            return res.status(400).json({msg : errors.array()})
        
        const id = req.params.id

        try {

            const edited_order = await Order.findByIdAndUpdate(id, {$set : req.body}, {new : true, lean : true})

            if(!edited_order)
                res.status(400).send(`Failed to update . No Order exists with ID : ${id}`)
            else
                res.status(200).json(edited_order)
        } catch (error) {
            console.error(error)
            res.status(500).send("Could not update Order details")
        }
        

    }
)


router.delete(
    "/:id", 
    [
        param("id" , "Invalid Order Id . Enter a Number").isInt()
    ] ,
    async ( req , res) => {
        const errors = validationResult(req)
        
        if(!errors.isEmpty())
            res.status(400).json({msg : errors.array()})

        const id = req.params.id

        try {
            const order = await Order.findByIdAndDelete(id)
            if(!order)
                res.status(404).send(`No order exists with the given Id : ${id} `)
            else
                res.status(200).json(order)

        } catch (error) {
            console.error(error)
            res.status(500).send('Could not Delete Order')
        }

        
    }
)

module.exports = router