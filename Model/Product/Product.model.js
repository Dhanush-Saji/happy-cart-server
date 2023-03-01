const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
    title:{type:String,required:true},
    des:{type:String,required:true},
    img:{type:String,required:true},
    category:{type:Array},
    size:{type:String},
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