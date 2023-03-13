const express = require('express');
const { CartModel } = require('../Model/Cart/Cart.model');
const cartRouter = express.Router()

cartRouter.get('/',(req,res)=>{
    res.status(200).send(`You are in user`)
})

//////////////Add cart/////////////////
cartRouter.post('/:userId',async(req,res)=>{
    try {
        const existingUser = await CartModel.findOne(req.params.userId);
        if (!existingUser) {
            const newProduct = new CartModel(req.body)
            const data = await newProduct.save()
            res.status(200).send(data)
        }
        let updated = await CartModel.findByIdAndUpdate(req.params.userId,req.body,{ new: true })
        res.status(201).json(updated)
        
    } catch (error) {
        res.status(500).send(`Error creating products: ${error.message}`)
    }
})

//////////////Update cart/////////////////
cartRouter.patch('/edit/:id',async(req,res)=>{
    const ID = req.params.id
    try {
        let updated = await CartModel.findByIdAndUpdate({_id:ID},req.body,{ new: true })
        res.status(201).json(updated)
    } catch (error) {
        res.status(500).send(`Error updating products: ${error.message}`) 
    }
})

//////////////Delete cart/////////////////
cartRouter.delete('/delete/:id',async(req,res)=>{
    const ID = req.params.id
    try {
        await CartModel.findByIdAndDelete({_id:ID})
        res.status(201).json('Deleted successfully')
    } catch (error) {
        res.status(500).send(`Error deleting products: ${error.message}`) 
    }
})

//////////////Get user cart/////////////////
cartRouter.get('/find/:userid',async(req,res)=>{
    
    try {
        const cart = await CartModel.findOne({userId:req.params.userid})
                    res.status(201).json(cart)
    } catch (error) {
        res.status(500).send(`Error getting products data: ${error.message}`)
    }
})

//////////////Get all cart/////////////////
cartRouter.get('/find',async(req,res)=>{
    
    try {
        const cart = await CartModel.find({})
                    res.status(201).json(cart)
    } catch (error) {
        res.status(500).send(`Error getting products data: ${error.message}`)
    }
})


module.exports={
    cartRouter
}