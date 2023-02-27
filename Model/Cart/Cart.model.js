const mongoose = require('mongoose');

const CartSchema = new mongoose.Schema({
    userId:{type:String,required:true},
    products:[
        {
            productId:{type:String},
            quality:{type:Number,default:1},
        }
    ]
},{
    timestamps:true
})
const CartModel = mongoose.model('cart',CartSchema)
module.exports={
    CartModel
}