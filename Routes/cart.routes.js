const express = require('express');
const { cartModel } = require('../Model/Cart/Cart.model');
const cartRouter = express.Router()

cartRouter.get('/',(req,res)=>{
    res.status(200).send(`You are in user`)
})
module.exports={
    cartRouter
}