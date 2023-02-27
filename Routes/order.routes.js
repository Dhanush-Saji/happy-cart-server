const express = require('express');
const { OrderModel } = require('../Model/Order/Order.model');
const orderRouter = express.Router()

orderRouter.get('/',(req,res)=>{
    res.status(200).send(`You are in user`)
})

//////////////Add orders/////////////////
orderRouter.post('/',async(req,res)=>{
    try {
        const newProduct = new OrderModel(req.body)
        const data = await newProduct.save()
        res.status(200).send(data)
        
    } catch (error) {
        res.status(500).send(`Error creating products: ${error.message}`)
    }
})

//////////////Update orders/////////////////
orderRouter.patch('/edit/:id',async(req,res)=>{
    const ID = req.params.id
    try {
        let updated = await OrderModel.findByIdAndUpdate({_id:ID},req.body,{ new: true })
        res.status(201).json(updated)
    } catch (error) {
        res.status(500).send(`Error updating products: ${error.message}`) 
    }
})

//////////////Delete orders/////////////////
orderRouter.delete('/delete/:id',async(req,res)=>{
    const ID = req.params.id
    try {
        await OrderModel.findByIdAndDelete({_id:ID})
        res.status(201).json('Deleted successfully')
    } catch (error) {
        res.status(500).send(`Error deleting products: ${error.message}`) 
    }
})

//////////////Get user orders/////////////////
orderRouter.get('/find/:userid',async(req,res)=>{
    
    try {
        const orders = await OrderModel.find({userId:req.params.userid})
                    res.status(201).json(orders)
    } catch (error) {
        res.status(500).send(`Error getting products data: ${error.message}`)
    }
})

//////////////Get all orders/////////////////
orderRouter.get('/find',async(req,res)=>{
    
    try {
        const orders = await OrderModel.find({})
                    res.status(201).json(orders)
    } catch (error) {
        res.status(500).send(`Error getting products data: ${error.message}`)
    }
})

//////////////Get monthly income/////////////////
orderRouter.get('/income',async(req,res)=>{
    const date = new Date()
    const lastMonth = new Date(date.setMonth(date.getMonth()-1))
    const previousMonth = new Date(new Date().setMonth(lastMonth.getMonth()-1))
    try {
        const income = await OrderModel.aggregate([
           { $match:{createdAt:{$gte:previousMonth}}},
           {$project:{
            month:{$month:'$createdAt'},
            sales:"$amount",
           }},
           {
            $group:{
                _id:"$month",
                total:{$sum:"$sales"}
           }
        }
        ])
        res.status(201).json(income)
    } catch (error) {
        res.status(500).send(`Error getting products data: ${error.message}`)
    }
})
module.exports={
    orderRouter
}

// {
//     "userId":"63fa35ccf6a448783f12f322",
//     "products":[
//       {"productId":"63fb8e0c1a8ea6ecbdcb7a3e","quantity":2},
//       {"productId":"63fb9321b5a5f033069dc66f"}
//       ],
//       "amount":1734,
//       "address":"Lorem ipsum dolor sit amet consectetur adipisicing elit. Exercitationem nesciunt dolorem, ea ad quasi sequi praesentium"
//   }