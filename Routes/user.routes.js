const express = require('express');
const {UserModel } = require('../Model/User/User.model');
const bcrypt = require('bcrypt');
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
//////////////Register/////////////////
userRouter.post('/register',async(req,res)=>{
    const {username,password,email} = req.body
  const saltRounds = 5;
    try {
        const existingUser = await UserModel.findOne({ username });
    if (existingUser) {
      res.status(400).json({ error: 'Username already exists' });
      return;
    }
      bcrypt.hash(password,saltRounds,async(err,hash_pass)=>{
        if(err){
          res.status(500).send(err)
        }
        else{
          const user = new UserModel({username,password:hash_pass,email})
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
    let {username,password} = req.body;
    try {
        const user = await UserModel.findOne({username})
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
        await UserModel.findByIdAndUpdate({_id:ID},req.body)
        res.status(201).json('Updated successfully')
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