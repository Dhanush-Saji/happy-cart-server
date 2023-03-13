const mongoose = require('mongoose');

const CartSchema = new mongoose.Schema({
    userId:{type:String,required:true},
    products:{type:Array,required:true}
},{
    timestamps:true
})
const CartModel = mongoose.model('cart',CartSchema)
module.exports={
    CartModel
}