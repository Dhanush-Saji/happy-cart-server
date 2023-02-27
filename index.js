const express = require('express');
const { connection} = require('./mongoDB/connect');
const app = express()
const dotenv = require('dotenv').config()
const cors = require('cors');
const { userRouter } = require('./Routes/User.routes');
const { productRouter } = require('./Routes/product.routes');
const { cartRouter } = require('./Routes/cart.routes');
const { orderRouter } = require('./Routes/order.routes');
const PORT  = process.env.PORT

app.use(cors())
app.use(express.json())

app.get('/',(req,res)=>{
    res.status(200).send('Welcome homepage')
})
app.use('/user',userRouter)
app.use('/product',productRouter)
app.use('/cart',cartRouter)
app.use('/orders',orderRouter)
app.listen(PORT,async()=>{
    console.log(`Listening on http://localhost:${PORT}`)
    try {
        await connection
        console.log('Connected to db')
    } catch (error) {
        console.log(`Error: ${error}`)
    }
})