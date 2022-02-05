const { Product } = require('../../Domain/product');
const express = require('express');
const { Category } = require('../../Domain/category');
const  mongoose  = require('mongoose');
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


router.post(`/`, async (req, res) =>{ 

    const category = await Category.findById(req.body.category)

    if(!category){

         res.status(400).send('Invalid category');
    }

    const product = new Product({
        name  : req.body.name,
        description  : req.body.description,
        richdescription  :  req.body.richdescription,
        imagesUrl  :  req.body.imagesUrl,  
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

router.put(`/:id`, async (req, res) => 
    {
       if(!mongoose.isValidObjectId(req.params.id)) 
            return res.status(400).send('The product id is invalid')

        const category = await Category.findById(req.body.category)

        if(!category){
    
             res.status(400).send('Invalid category');
        }
        
        const product = await Product.findByIdAndUpdate
        ( 
            req.params.id,
            {
                name  : req.body.name,
                description  : req.body.description,
                richdescription  : req.body.richdescription,
                imagesUrl  : req.body.imagesUrl,
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
        if(!product)
            return res.status(404)
            .send('the product cannot be updated!');
        
        res.send(product);
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