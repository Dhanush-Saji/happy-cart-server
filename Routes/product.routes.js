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
//////////////Get popular products/////////////////
productRouter.get('/popular',async(req,res)=>{
    try {
        const product = await ProductModel.aggregate([{$sample:{size:4}}])
        res.status(201).json(product)
    } catch (error) {
        res.status(500).send(`Error getting products data: ${error.message}`)
    }
})
//////////////Get all products/////////////////
productRouter.get('/find',async(req,res)=>{
    var query={}
    try {
        if(req.query.title){
            const regex = new RegExp(req.query.title, 'i');
            query.title = regex
        }
        if(req.query.category){
            req.query.category.indexOf('headphones') != -1?req.query.category[req.query.category.indexOf('headphones')] = '6404aee53a8c745b2ebc3506':null
            req.query.category.indexOf('speaker') != -1?req.query.category[req.query.category.indexOf('speaker')] = '6404af323a8c745b2ebc3509':null
            req.query.category.indexOf('smart_watches') != -1?req.query.category[req.query.category.indexOf('smart_watches')] = '6404e9c1c536cacf42544afa':null
            req.query.category.indexOf('wireless_earbuds') != -1?req.query.category[req.query.category.indexOf('wireless_earbuds')] = '6405077cc536cacf42545431':null
            query.category={$in:req.query.category}
        }
        if(req.query.price){
            const price = req.query.price
            query['$and'] = price.map((item)=>{
                let [min,max] = item.split('-')
                return min && max
        ? { price: { $gte: min, $lte: max } }
        : { price: { $gte: min } };
            })
        }
            const product = await ProductModel.find(query)
            if(!product){
                return res.status(404).send({message: "No products found"})
            }
            res.status(201).json(product)
    } catch (error) {
        res.status(500).send(`Error getting products data: ${error.message}`)
    }
})

//////////////Get single products/////////////////
productRouter.get('/find/:id',async(req,res)=>{
    
    try {
        const product = await ProductModel.findById(req.params.id).populate('category')
                    res.status(201).json(product)
    } catch (error) {
        res.status(500).send(`Error getting products data: ${error.message}`)
    }
})

//////////////Get product by Category/////////////////
productRouter.get('/findbycat/:id',async(req,res)=>{
    try {
        const products = await ProductModel.find({category:req.params.id})
        res.status(201).json(products)
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