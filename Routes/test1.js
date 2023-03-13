const dotenv = require('dotenv').config()
const express = require('express');
const { OrderModel } = require('../Model/Order/Order.model');
const stripe = require('stripe')(process.env.STRIPE_KEY)
const stripeRouter = express.Router()
stripeRouter.post('/test',async(req,res)=>{
  res.status(201).send(req.body)
})
stripeRouter.post('/create-checkout-session', async (req, res) => {
  const line_items=req.body.cartItems.map((item)=>{
    return{
      price_data: {
        currency: 'inr',
        product_data: {
          name: item.title,
          images:[item.imageurl],
          description:item.des,
          metadata:{
            id:item._id
          }
        },
        unit_amount: item.price*100,
      },
      quantity: item.quantity,
    }
  })
    const session = await stripe.checkout.sessions.create({
      payment_method_types:['card'],
      shipping_address_collection: {allowed_countries: ['IN']},
      shipping_options: [
        {
          shipping_rate_data: {
            type: 'fixed_amount',
            fixed_amount: {amount: 0, currency: 'inr'},
            display_name: 'Free shipping',
            delivery_estimate: {
              minimum: {unit: 'business_day', value: 5},
              maximum: {unit: 'business_day', value: 7},
            },
          },
        },
        {
          shipping_rate_data: {
            type: 'fixed_amount',
            fixed_amount: {amount: 8000, currency: 'inr'},
            display_name: 'Fast shipping',
            delivery_estimate: {
              minimum: {unit: 'business_day', value: 1},
              maximum: {unit: 'business_day', value: 2},
            },
          },
        },
      ],
      phone_number_collection:{
        enabled:true
      },
      line_items,
      mode: 'payment',
      success_url: `${process.env.CLIENT_URL}/checkout-success`,
      cancel_url: `${process.env.CLIENT_URL}/product`,
    });
  
    res.send(JSON.stringify({url:session.url}));
  });
//Stripe Webhook

// This is your Stripe CLI webhook secret for testing your endpoint locally.
const webhookSecret = process.env.STRIPE_WEB_HOOK;

stripeRouter.post('/webhook', express.raw({type: 'application/json', verify: false}), async(req, res) => {
  let event;
  if (webhookSecret) {
    // Retrieve the event by verifying the signature using the raw body and secret.
    let signature = req.headers["stripe-signature"];

    try {
      event = stripe.webhooks.constructEvent(
        req.body,
        signature,
        webhookSecret
      );
    } catch (err) {
      console.log(`⚠️  Webhook signature verification failed:  ${err}`);
      return res.sendStatus(400);
    }
    // Extract the object from the event.
    data = event.data.object;
    eventType = event.type;
  } else {
    // Webhook signing is recommended, but if the secret is not configured in `config.js`,
    // retrieve the event data directly from the request body.
    data = req.body.data.object;
    eventType = req.body.type;
  }
  let payment
  // Handle the event
  if (eventType === "checkout.session.completed") {
    try {
        const session = await stripe.checkout.sessions.retrieve(data.id, {expand: ['payment_intent', 'line_items']});
        const products = session.line_items.data.map(lineItem => ({
            productId: lineItem.price.product.metadata.id,
            quantity: lineItem.quantity
          }));
          console.log(products)
    } catch (error) {
        
    }
  }

  // Return a 200 response to acknowledge receipt of the event
  res.send({'payment':payment}).end();
});

  module.exports ={
    stripeRouter
  }