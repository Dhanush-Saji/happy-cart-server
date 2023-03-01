const express = require('express');
const {UserModel } = require('../Model/User/User.model');
const bcrypt = require('bcrypt');
const { cloudinary } = require('../utils/cloudinary');
const userRouter = express.Router()

//////////////Get single user/////////////////
userRouter.get('/find/:id',async(req,res)=>{
    
    try {
        const user = await UserModel.findById(req.params.id,'-password')
                    res.status(201).json(user)
    } catch (error) {
        res.status(500).send(`Error getting user data: ${error.message}`)
    }
})
//////////////Get all user/////////////////
userRouter.get('/find',async(req,res)=>{
    const query = req.query.new
    try {
        const user = query?await UserModel.find({},'-password').sort({createdAt:-1}).limit(5):await UserModel.find({},'-password')
                    res.status(201).json(user)
    } catch (error) {
        res.status(500).send(`Error getting user data: ${error.message}`)
    }
})
//////////////Get user stats/////////////////
userRouter.get('/stats',async(req,res)=>{
    const date = new Date()
    const lastYear = new Date(date.setFullYear(date.getFullYear()-1))
    try {
        const data = await UserModel.aggregate([
            {$match:{createdAt:{$gte:lastYear}}},
            {$project:{
                month:{$month:"$createdAt"}
            }},
            {
                $group:{
                    _id:'$month',
                    total:{$sum:1}
                }
            }
        ])
                    res.status(201).json(data)
    } catch (error) {
        res.status(500).send(`Error: ${error.message}`)
    }
})
//////////////Register/////////////////
userRouter.post('/register',async(req,res)=>{
    const {name,password,email,avatar,isAdmin} = req.body
  const saltRounds = 5;
    try {
        const existingUser = await UserModel.findOne({ email });
    if (existingUser) {
      res.status(400).json({ error: 'Email already exists' });
      return;
    }
      bcrypt.hash(password,saltRounds,async(err,hash_pass)=>{
        if(err){
          res.status(500).send(err)
        }
        else{
            let uploadRes
            if(avatar){
                 uploadRes = await cloudinary.uploader.upload(avatar,{
                    upload_preset:'happyCartUserAvatar'
                })
            }
          const user = uploadRes? new UserModel({name,password:hash_pass,email,avatar:uploadRes,isAdmin}):new UserModel({name,password:hash_pass,email,isAdmin})
          const data = await user.save()
          let {password,...others} = data._doc
          res.status(201).json(others)
        }
      })
    } catch (error) {
        res.status(500).send(`Error registering user: ${error.message}`)
    }
})
//////////////Login/////////////////
userRouter.post('/login',async(req,res)=>{
    let {email,password} = req.body;
    try {
        const user = await UserModel.findOne({email})
        if(user){
            bcrypt.compare(password,user.password,(err,result)=>{
                if(result){
                    let {password,...others} = user._doc
                    res.status(201).json(others)
                }
                else{
                    res.status(500).send('Invalid Credentials')
                }
            })
        }
        else{
            res.status(500).send('User not found')
        }
    } catch (error) {
        res.status(500).send(`Error login user: ${error.message}`)
    }
})
//////////////Update details/////////////////
userRouter.patch('/edit/:id',async(req,res)=>{
    const ID = req.params.id
    try {
        let updated = await UserModel.findByIdAndUpdate({_id:ID},req.body,{ new: true })
        res.status(201).json(updated)
    } catch (error) {
        res.status(500).send(`Error updating user: ${error.message}`) 
    }
})
//////////////Delete user/////////////////
userRouter.delete('/delete/:id',async(req,res)=>{
    const ID = req.params.id
    try {
        await UserModel.findByIdAndDelete({_id:ID})
        res.status(201).json('Deleted successfully')
    } catch (error) {
        res.status(500).send(`Error updating user: ${error.message}`) 
    }
})

module.exports={
    userRouter
}

// {
//     "username":"dev",
//     "email":"dev@gmail.com",
//     "password":"dev"
//   }