const express = require('express');
const { ProductModel } = require('../Model/Product/Product.model');
const { cloudinary } = require('../utils/cloudinary');
const productRouter = express.Router()

productRouter.get('/',(req,res)=>{
    
    res.status(200).send(`You are in product`)
})

//////////////Add product/////////////////
productRouter.post('/',async(req,res)=>{
    const {title,image} = req.body
    try {
        const existingProduct = await ProductModel.findOne({ title });
        if (existingProduct) {
          res.status(400).json({ error: 'Product already exists' });
          return;
        }
        let uploadRes
            if(image){
                 uploadRes = await cloudinary.uploader.upload(image,{
                    folder:'Product_images'
                })
                if(!uploadRes){
                    res.status(500).send(`Image uploading went wrong`)
                }
            }
        const newProduct = new ProductModel({...req.body,image:uploadRes})
        const data = await newProduct.save()
        res.status(200).send(data)
        
    } catch (error) {
        res.status(500).send(`Error creating products: ${error.message}`)
    }
})

//////////////Update details/////////////////
productRouter.patch('/edit/:id',async(req,res)=>{
    const ID = req.params.id
    try {
        let updated = await ProductModel.findByIdAndUpdate({_id:ID},req.body,{ new: true })
        res.status(201).json(updated)
    } catch (error) {
        res.status(500).send(`Error updating products: ${error.message}`) 
    }
})

//////////////Delete product/////////////////
productRouter.delete('/delete/:id',async(req,res)=>{
    const ID = req.params.id
    try {
        await ProductModel.findByIdAndDelete({_id:ID})
        res.status(201).json('Deleted successfully')
    } catch (error) {
        res.status(500).send(`Error deleting products: ${error.message}`) 
    }
})

//////////////Get all products/////////////////
productRouter.get('/find',async(req,res)=>{
    const qnew = req.query.new
    const qcategory = req.query.category
    try {
        if(qnew){
            const product = await ProductModel.find({}).sort({createdAt:-1}).limit(5)
            res.status(201).json(product)
        }else if(qcategory){
            const product = await ProductModel.find({
                category:{
                    $in:[qcategory]
                }})
            res.status(201).json(product)
        }else{
            const product = await ProductModel.find({})
            res.status(201).json(product)
        }
    } catch (error) {
        res.status(500).send(`Error getting products data: ${error.message}`)
    }
})

//////////////Get single products/////////////////
productRouter.get('/find/:id',async(req,res)=>{
    
    try {
        const product = await ProductModel.findById(req.params.id)
                    res.status(201).json(product)
    } catch (error) {
        res.status(500).send(`Error getting products data: ${error.message}`)
    }
})


module.exports={
    productRouter
}

// {
//     "title":"Puma T-shirt",
//     "des":"Lorem ipsum dolor sit amet consectetur adipisicing elit. Dicta quae, rem aperiam ut laboriosam assumenda recusandae",
//     "img":"https://m.media-amazon.com/images/I/71sC3wxkRrL._UY550_.jpg",
//     "category":["tshirt","man"],
//     "size":"M",
//     "color":"red",
//     "price":542
//   }