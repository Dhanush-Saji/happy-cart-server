const express = require('express');
const { connection} = require('./mongoDB/connect');
const app = express()
const dotenv = require('dotenv').config()
const cors = require('cors');
const { userRouter } = require('./Routes/User.routes');
const { productRouter } = require('./Routes/product.routes');
const { cartRouter } = require('./Routes/cart.routes');
const { orderRouter } = require('./Routes/order.routes');
const bodyParser = require('body-parser');
const { categoryRouter } = require('./Routes/category.routes');
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));

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
app.use('/category',categoryRouter)
app.listen(PORT,async()=>{
    console.log(`Listening on http://localhost:${PORT}`)
    try {
        await connection
        console.log('Connected to db')
    } catch (error) {
        console.log(`Error: ${error}`)
    }
})