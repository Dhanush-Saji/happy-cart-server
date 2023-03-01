const express = require('express');
const stripe = require('stripe')(process.env.STRIPE_KEY)
const stripeRouter = express.Router()

stripeRouter.post('/payment',(req,res)=>{
    stripe.charges.create({
        source:req.body.tokenId,
        amount:req.body.amount,
        currency:"usd"
    },(stripeErr,stripeRes)=>{
        if(stripeErr){
            res.status(500).send(`${stripeErr}`)
        }else{
            res.status(201).json(stripeRes)
        }
    })
})
module.exports={
    stripeRouter
}