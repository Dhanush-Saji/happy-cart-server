const express = require('express');
const { orderModel } = require('../Model/Order/Order.model');
const orderRouter = express.Router()

orderRouter.get('/',(req,res)=>{
    res.status(200).send(`You are in user`)
})

module.exports={
    orderRouter
}