const mongoose = require('mongoose');

const CategorySchema = new mongoose.Schema({
    title:{type:String,required:true},
    image:{type:Object},
},{
    timestamps:true
})
const CategoryModel = mongoose.model('category',CategorySchema)
module.exports={
    CategoryModel
}
// Lorem ipsum dolor sit amet consectetur adipisicing elit. Dicta quae, rem aperiam ut laboriosam assumenda recusandae quod numquam obcaecati quibusdam, animi nam odit vero, eaque molestiae repellendus optio. Recusandae, cupiditate.