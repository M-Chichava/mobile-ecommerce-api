const { Product } = require('../../Domain/product');
const express = require('express');
const { Category } = require('../../Domain/category');
const  mongoose  = require('mongoose');
const multer = require('multer'); 
const multerConfig = require('./multer')
const router = express.Router();

 

router.get(`/`, async (req, res) =>{

    const productList = await Product.find().populate('category');

    if(!productList)
    {
        res.status(500).json({
            success: false
        })
    }
    res.send(productList)
});


router.get(`/:id`, async (req, res) =>
    {

        
        if(!mongoose.isValidObjectId(req.params.id)) 
            return res.status(400).send('The product Id is Invalid.')
        const product = await Product.findById(req.params.id).populate('category');

        if(!product)
        {
            res.status(500).json(
                {
                    message: 'The product with the given Id was not found.'
                }
            )
        }
        res.status(200).send(product);
    }
)


router.post(`/`, multer(multerConfig).single('productImage'), async (req, res) =>{ 
    console.log(req.file) 
    const category = await Category.findById(req.body.category)
    const file = req.file;

    if(!category){

         res.status(400).send({message: 'Invalid category'});
    }
    if(!file){

         res.status(400).send({message: 'The product file is missing'});
    }
    const fileName = req.file.filename
    const basePath = `${req.protocol}://${req.get('host')}/images`;  
    const product = new Product({
        name  : req.body.name,
        description  : req.body.description,
        richdescription  :  req.body.richdescription,
        productImage: `${basePath}${fileName}`,  
        brand  :  req.body.brand, 
        price  :  req.body.price,
        category  :  req.body.category,
        countStock  :  req.body.countStock,
        rating  :  req.body.rating,
        numReviews  :  req.body.numReviews,
        isFeatured  :  req.body.isFeatured,
    })

    const products = await product.save()
     
    if(!products)
    {
        return res.status(500).send('The product cannot be created')
    }
    res.send(products);
});

router.put(`/:id`, multer(multerConfig).single('productImage'), async (req, res) => 
    {
       if(!mongoose.isValidObjectId(req.params.id)) 
            return res.status(400).send('The product id is invalid')

        const category = await Category.findById(req.body.category)

        if(!category){
    
             res.status(400).send('Invalid category');
        }
        
        const product = await Product.findById(req.params.id)

        if(!product){
    
             res.status(400).send('Invalid Product');
        }
        
        const file = req.file
        let imagePath;

        if(file){
            const fileName = req.file.filename
            const basePath = `${req.protocol}://${req.get('host')}/images`;  
            imagePath = `${basePath}${fileName}`
        } else {
            imagePath = product.productImage;
        }
        
        const updatedproduct = await Product.findByIdAndUpdate
        ( 
            req.params.id,
            {
                name  : req.body.name,
                description  : req.body.description,
                richdescription  : req.body.richdescription,
                productImages  : req.body.image,
                brand  : req.body.brand,
                price  : req.body.price,
                category  : req.body.category,
                countStock  : req.body.countStock,
                rating  : req.body.rating,
                numReviews  : req.body.numReviews,
                isFeatured  : req.body.isFeatured
            },     
            {new: true} 
        )
        if(!updatedproduct)
            return res.status(404)
            .send('the product cannot be updated!');
        
        res.send(updatedproduct);
    }
)


router.delete (`/:id`, (req, res) => 
    {
        if(!mongoose.isValidObjectId(req.params.id)) 
            return res.status(400).send('The product id is invalid')

        Product.findByIdAndRemove(req.params.id)
        .then( product =>
            {
                if(product)
                {
                    return res.status(200).json(
                            {
                                success: true,
                                message: 'the product is deleted'
                            }
                        );
                } 
                else
                    {
                        return res.status(404).json(
                            {
                                success: false,
                                message: 'the product was not found'
                            }
                        );
                    }                    
            }
        )
        .catch(err => 
            {
                return res.status(400).json(
                        {
                            success: false,
                            error: err
                        }
                    )
            }
        )
    }
);

router.get('/get/count', async (req, res) =>{
    const productCount = await Product.countDocuments()
    if(!productCount)
    {res.status(500).json({success:false})}
    
    res.send({productCount: productCount})
});

router.get('/get/feature/:count', async (req, res) =>{
    const count = req.params.count ? req.params.count : 0
    const productFeature = await Product.find({isFeatured: true}).limit(+count)
    
    if(!productFeature)
    {res.status(500).json({success:false})}
    
    res.send(productFeature)
});

module.exports = router;