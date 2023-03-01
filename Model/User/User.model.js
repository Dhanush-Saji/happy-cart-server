const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    name:{type:String},
    email:{type:String,required:true,unique:true},
    avatar:{type:Object},
    password:{type:String,required:true},
    isAdmin:{type:Boolean,required:true,default:false},
},{
    timestamps:true
})
const UserModel = mongoose.model('user',UserSchema)
module.exports={
    UserModel
}