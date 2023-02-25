const express = require('express');
const { connection} = require('./mongoDB/connect');
const app = express()
const dotenv = require('dotenv').config()
const cors = require('cors');
const { userRouter } = require('./Routes/User.routes');
const PORT  = process.env.PORT

app.use(cors())
app.use(express.json())

app.get('/',(req,res)=>{
    res.status(200).send('Welcome homepage')
})
app.use('/user',userRouter)
app.listen(PORT,async()=>{
    console.log(`Listening on http://localhost:${PORT}`)
    try {
        await connection
        console.log('Connected to db')
    } catch (error) {
        console.log(`Error: ${error}`)
    }
})