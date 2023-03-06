const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
    title:{type:String,required:true},
    des:{type:String,required:true},
    image:{type:Object,required:true},
    category:{type:mongoose.Schema.Types.ObjectId,ref:'category'},
    color:{type:String},
    price:{type:Number,required:true},
},{
    timestamps:true
})
const ProductModel = mongoose.model('product',ProductSchema)
module.exports={
    ProductModel
}
// Lorem ipsum dolor sit amet consectetur adipisicing elit. Dicta quae, rem aperiam ut laboriosam assumenda recusandae quod numquam obcaecati quibusdam, animi nam odit vero, eaque molestiae repellendus optio. Recusandae, cupiditate.