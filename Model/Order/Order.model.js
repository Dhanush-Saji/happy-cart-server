const mongoose = require('mongoose');

const OrderSchema = new mongoose.Schema({
    userId:{type:String,required:true},
    products:[
        {
            productId:{type:mongoose.Schema.Types.ObjectId,ref:'product'},
            quantity:{type:Number,default:1},
        }
    ],
    amount:{type:Number,required:true},
    address:{type:Object,required:true},
    status:{type:String,default:'Pending'},
},{
    timestamps:true
})
const OrderModel = mongoose.model('order',OrderSchema)
module.exports={
    OrderModel
}
