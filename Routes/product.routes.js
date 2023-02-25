const express = require('express');
const { productModel } = require('../Model/Product/Product.model');
const productRouter = express.Router()

productRouter.get('/',(req,res)=>{
    res.status(200).send(`You are in user`)
})
module.exports={
    productRouter
}