const express = require("express")
const router = express.Router()
const Customer = require("../models/customer")
const Order = require("../models/order")
const Shipping  = require("../models/shipping")
const {body, param, validationResult} = require("express-validator")

router.post(
    "/",
    [
        //TODO actually you cannot just check for notempty for string values 
        body("address", "Provide a Address!").not().isEmpty(),
        body("city", "Provide a City Name)!").not().isEmpty() , 
        body("pincode" , "Provide a Pincode").not().isEmpty(),
        body("customer" , "Provide a Valid Customer ID (number)").isInt(),
        body("order" , "Provide a Valid Order ID (number)").isInt()
    ],
    async (req,res) =>{

        const errors = validationResult(req)
        if(!errors.isEmpty())
            return res.status(400).json({msg : errors.array()})

        const new_shipping = new Shipping(req.body)

        try {

            await new_shipping.save()
            res.status(200).send(new_shipping._doc)

        } catch (error) {

            console.log(error)
            res.status(500).send("Server Error . Could not create Shipping Address")
        }
        
    }
)

router.get(
    "/", 
    async ( req , res) => {

        try {
            const shippings = await Shipping.find({})
            res.status(200).json(shippings)
        } catch (error) {
            console.error(error)
            res.status(500).send('Could not fetch Shipping Addresses')
        }

        
    }
)

router.get(
    "/:id", 
    [
        param("id" , "Invalid Shipping Address Id . Enter a Number").isInt()
    ] ,
    async ( req , res) => {
        const errors = validationResult(req)
        
        if(!errors.isEmpty())
            res.status(400).json({msg : errors.array()})

        const id = req.params.id

        try {
            const shipping = await Shipping.findById(id)
            if(!shipping)
                res.status(404).send(`No Shipping Address exists with the given Id : ${id} `)
            else
                res.status(200).json(shipping)

        } catch (error) {
            console.error(error)
            res.status(500).send('Could not fetch Shipping Address')
        }

        
    }
)

router.put(
    "/:id",
    [
        param("id" , "Invalid Shipping Address Id . It should be a Number").isInt(),
        body("address", "Provide a Address!").not().isEmpty(),
        body("city", "Provide a City Name)!").not().isEmpty() , 
        body("pincode" , "Provide a Pincode").not().isEmpty(),
        body("customer" , "Provide a Valid Customer ID (number)").isInt(),
        body("order" , "Provide a Valid Order ID (number)").isInt()
    ],
    async (req,res) =>{
        const errors = validationResult(req)
        if(!errors.isEmpty())
            return res.status(400).json({msg : errors.array()})
        
        const id = req.params.id

        try {

            const edited_shipping = await Shipping.findByIdAndUpdate(id, {$set : req.body}, {new : true, lean : true})

            if(!edited_shipping)
                res.status(400).send(`Failed to update . No Shipping Address exists with ID : ${id}`)
            else
                res.status(200).json(edited_shipping)
        } catch (error) {
            console.error(error)
            res.status(500).send("Could not update Shipping Address")
        }
        

    }
)


router.delete(
    "/:id", 
    [
        param("id" , "Invalid Shipping Address Id . Enter a Number").isInt()
    ] ,
    async ( req , res) => {
        const errors = validationResult(req)
        
        if(!errors.isEmpty())
            res.status(400).json({msg : errors.array()})

        const id = req.params.id

        try {
            const shipping = await Shipping.findByIdAndDelete(id)
            if(!shipping)
                res.status(404).send(`No shipping address exists with the given Id : ${id} `)
            else
                res.status(200).json(shipping)

        } catch (error) {
            console.error(error)
            res.status(500).send('Could not Delete shipping address')
        }

        
    }
)

module.exports = router