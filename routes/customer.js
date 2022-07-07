const express = require("express")
const router = express.Router()
const Customer = require("../models/customer")
const {body, param, validationResult} = require("express-validator")

router.post(
    "/",
    [
        body("name", "Provide a Name!").not().isEmpty(),
        body("email", "Provide a Valid Email ID!").isEmail() , 
        body("city" , "Provide a City name").not().isEmpty(),
        body("mobile" , "Provide a Mobile Number").isMobilePhone()
    ],
    async (req,res) =>{

        const errors = validationResult(req)
        if(!errors.isEmpty())
            return res.status(400).json({msg : errors.array()})
        
        const new_customer = new Customer(req.body)

        try {

            await new_customer.save()
            res.status(200).send(new_customer._doc)

        } catch (error) {

            console.log(error)
            res.status(500).send("Server Error . Could not create Customer")
        }
        
    }
)

router.get(
    "/", 
    async ( req , res) => {

        try {
            const customers = await Customer.find({})
            res.status(200).json(customers)
        } catch (error) {
            console.error(error)
            res.status(500).send('Could not fetch Customers')
        }

        
    }
)

router.get(
    "/:id", 
    [
        param("id" , "Invalid Customer Id . Enter a Number").isInt()
    ] ,
    async ( req , res) => {
        const errors = validationResult(req)
        
        if(!errors.isEmpty())
            res.status(400).json({msg : errors.array()})

        const id = req.params.id

        try {
            const customer = await Customer.findById(id)
            if(!customer)
                res.status(404).send(`No customer exists with the given Id : ${id} `)
            else
                res.status(200).json(customer)

        } catch (error) {
            console.error(error)
            res.status(500).send('Could not fetch Customer')
        }

        
    }
)

router.put(
    "/:id",
    [
        param("id" , "Invalid Customer Id . Enter a Number").isInt(),
        body("name", "Provide a Name!").not().isEmpty(),
        body("email", "Provide a Valid Email ID!").isEmail() , 
        body("city" , "Provide a City name").not().isEmpty(),
        body("mobile" , "Provide a Mobile Number").isMobilePhone()
    ],
    async (req,res) =>{
        const errors = validationResult(req)
        if(!errors.isEmpty())
            return res.status(400).json({msg : errors.array()})
        
        const id = req.params.id

        try {

            const edited_customer = await Customer.findByIdAndUpdate(id, {$set : req.body}, {new : true, lean : true})

            if(!edited_customer)
                res.status(400).send(`Failed to update . No customer exists with ID : ${id}`)
            else
                res.status(200).json(edited_customer)
        } catch (error) {
            console.error(error)
            // TODO it may fail because of duplicate Email , Phone . 
            res.status(500).send("Could not update Customer details")
        }
        

    }
)


router.delete(
    "/:id", 
    [
        param("id" , "Invalid Customer Id . Enter a Number").isInt()
    ] ,
    async ( req , res) => {
        const errors = validationResult(req)
        
        if(!errors.isEmpty())
            res.status(400).json({msg : errors.array()})

        const id = req.params.id

        try {
            const customer = await Customer.findByIdAndDelete(id)
            if(!customer)
                res.status(404).send(`No customer exists with the given Id : ${id} `)
            else
                res.status(200).json(customer)

        } catch (error) {
            console.error(error)
            res.status(500).send('Could not Delete Customer')
        }

        
    }
)

module.exports = router