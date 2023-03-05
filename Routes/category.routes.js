const express = require('express');
const { CategoryModel } = require('../Model/Category/Category.model');
const { cloudinary } = require('../utils/cloudinary');
const categoryRouter = express.Router()

categoryRouter.get('/',(req,res)=>{
    res.status(200).send(`You are in category`)
})

//////////////Add category/////////////////
categoryRouter.post('/',async(req,res)=>{
    const {title,image} = req.body
    try {
        const existingCategory = await CategoryModel.findOne({ title });
        if (existingCategory) {
          res.status(400).json({ error: 'Category already exists' });
          return;
        }
        let uploadRes
            if(image){
                 uploadRes = await cloudinary.uploader.upload(image,{
                    folder:'Category_images'
                })
                if(!uploadRes){
                    res.status(500).send(`Image uploading went wrong`)
                }
            }
        const newCategory = new CategoryModel({title,image:uploadRes})
        const data = await newCategory.save()
        res.status(200).send(data)
        
    } catch (error) {
        res.status(500).send(`Error creating category: ${error.message}`)
    }
})

//////////////Get all category/////////////////
categoryRouter.get('/find',async(req,res)=>{  
    try {
        const cart = await CategoryModel.find({})
                    res.status(201).json(cart)
    } catch (error) {
        res.status(500).send(`Error getting category data: ${error.message}`)
    }
})


module.exports={
    categoryRouter
}