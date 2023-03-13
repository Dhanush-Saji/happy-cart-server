const dotenv = require('dotenv').config()
const express = require('express');
const { OrderModel } = require('../Model/Order/Order.model');
const stripe = require('stripe')(process.env.STRIPE_KEY)
const stripeRouter = express.Router()
stripeRouter.post('/test',async(req,res)=>{
  res.status(201).send(req.body)
})
stripeRouter.post('/create-checkout-session', async (req, res) => {
  const cartItemsString = JSON.stringify(req.body.cartItems.toString());

  const customer = await stripe.customers.create({
    metadata:{
      userId:req.body.userId,
      cart:lineItems.map(item => item.metadata.id);
    }
  })
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
      customer:customer.id,
      line_items,
      mode: 'payment',
      success_url: `${process.env.CLIENT_URL}/checkout-success`,
      cancel_url: `${process.env.CLIENT_URL}/product`,
    });
  
    res.send(JSON.stringify({url:session.url}));
  });

  // Create order function

const createOrder = async (customer, data) => {
  console.log('data',data)
  console.log('customer',customer)
  var products = []
  
  try {
    const Items = JSON.parse(customer.metadata.cart);
  
    // products = Items.map((item) => {
    //   return {
    //     productId: item.id,
    //     quantity: item.cartQuantity,
    //   };
    // });
  
    const newOrder = new OrderModel({
      userId: customer.metadata.userId,
      customerId: data.customer,
      paymentIntentId: data.payment_intent,
      // products:Items,
      subtotal: data.amount_subtotal/100,
      total: data.amount_total/100,
      shipping: data.customer_details,
      payment_status: data.payment_status,
    });
    const savedOrder = await newOrder.save();
    // console.log("Processed Order:", savedOrder);
  } catch (err) {
    console.log(err);
  }
};


//Stripe Webhook

// This is your Stripe CLI webhook secret for testing your endpoint locally.
const webhookSecret = process.env.STRIPE_WEB_HOOK;

stripeRouter.post('/webhook', express.raw({type: 'application/json'}), (req, res) => {
  if (webhookSecret) {
    // Retrieve the event by verifying the signature using the raw body and secret.
    let event;
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

  // Handle the event
  if (eventType === "checkout.session.completed") {
    stripe.customers
      .retrieve(data.customer)
      .then(async (customer) => {
        try {
          // CREATE ORDER
          createOrder(customer, data);
        } catch (err) {
          console.log(typeof createOrder);
          console.log(err);
        }
      })
      .catch((err) => console.log(err.message));
  }

  // Return a 200 response to acknowledge receipt of the event
  res.send().end();
});

  module.exports ={
    stripeRouter
  }