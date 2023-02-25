const mongoose = require("mongoose");
const dotenv = require('dotenv').config()
const MONGO = process.env.MONGO
mongoose.set('strictQuery', true)
const connection = mongoose.connect(`${MONGO}`)

module.exports = {
  connection
};
