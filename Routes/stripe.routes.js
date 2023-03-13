const dotenv = require('dotenv').config()
const express = require('express');
const { OrderModel } = require('../Model/Order/Order.model');
const stripe = require('stripe')(process.env.STRIPE_KEY)
const stripeRouter = express.Router()
stripeRouter.post('/test',async(req,res)=>{
  res.status(201).send(req.body)
})
let tempData;
stripeRouter.post('/create-checkout-session', async (req, res) => {
  try {
    const customer = await stripe.customers.create({
      metadata:{
        userId:req.body.userId,
      }
    })
    tempData=req.body.cartItems
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
        customer:customer.id,
        mode: 'payment',
        success_url: `${process.env.CLIENT_URL}/checkout-success`,
        cancel_url: `${process.env.CLIENT_URL}/error`,
      });
    
      res.send(JSON.stringify({url:session.url}));
  } catch (error) {
    res.status(400).json({error:'error in session creation'})
  }
 
  });

  // const createOrder = async (customer, data) => {
  //   var items = tempData
    
  //   try {
    
  //     const newOrder = new OrderModel({
  //       userId: customer.metadata.userId,
  //       customerId: data.customer,
  //       paymentIntentId: data.payment_intent,
  //       products:items,
  //       subtotal: data.amount_subtotal/100,
  //       total: data.amount_total/100,
  //       shipping: data.customer_details,
  //       payment_status: data.payment_status,
  //       shipping_cost: data.shipping_cost.amount_total/100,
  //       transaction_status: data.status,
  //     });
  //     const savedOrder = await newOrder.save();
  //   } catch (err) {
  //     console.log(err);
  //   }
  // };

//Stripe Webhook

// This is your Stripe CLI webhook secret for testing your endpoint locally.

stripeRouter.post('/webhooks', express.raw({type: 'application/json'}), async(req, res) => {
  const webhookSecret = process.env.STRIPE_WEB_HOOK;
  try {
    let event;
    if (webhookSecret) {
      // Retrieve the event by verifying the signature using the raw body and secret.
      let signature = req.headers["stripe-signature"];
      if(signature == null) { throw new UnknownError('No stripe signature found!');  }

      const stripePayload = req.rawBody || req.body;
      try {
        event = stripe.webhooks.constructEvent(
          // req.body,
          stripePayload,
          signature?.toString(),
          webhookSecret
        );
      } catch (err) {
        console.log(`⚠️  Webhook signature verification failed:  ${err}`);
        return res.status(500).send({error:err});
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
        stripe.customers.retrieve(data.customer).then(async (customer) =>{
          try {
                      // CREATE ORDER
                      var items = tempData
                      const newOrder = new OrderModel({
                        userId: customer.metadata.userId,
                        customerId: data.customer,
                        paymentIntentId: data.payment_intent,
                        products:items,
                        subtotal: data.amount_subtotal/100,
                        total: data.amount_total/100,
                        shipping: data.customer_details,
                        payment_status: data.payment_status,
                        shipping_cost: data.shipping_cost.amount_total/100,
                        transaction_status: data.status,
                      });
                      const savedOrder = await newOrder.save();
        res.status(200).send({ success: true, message: 'Order created successfully' });
                    } catch (err) {
                      console.log(err);
                      res.status(400).send({'err2':err})
                    }
        }).catch((err)=>{
          res.status(400).send({'err3':err})
        })
      } catch (error) {
        res.status(400).send({'err4':err})
      }
    }
    
  } catch (error) {
    
    res.status(400).send({error:error})
  }

});

  module.exports ={
    stripeRouter
  }