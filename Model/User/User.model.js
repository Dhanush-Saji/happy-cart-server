const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    username:{type:String,required:true,unique:true},
    email:{type:String,required:true,unique:true},
    avatar:{type:String},
    password:{type:String,required:true},
    isAdmin:{type:Boolean,required:true,default:false},
},{
    timestamps:true
})
const UserModel = mongoose.model('user',UserSchema)
module.exports={
    UserModel
}