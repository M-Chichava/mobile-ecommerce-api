const {Product} = require('../../Domain/product');
const express = require('express');
const router = express.Router();


router.get(`/`, async (req, res) =>{
    const productList = await Product.find();

    if(!productList)
    {
        res.status(500).json({
            success: false
        })
    }
    res.send(productList)
});


router.post(`/`, (req, res) =>{
    const product = new Product(
        {
            name : req.body.name,
            brand : req.body.brand,
            model : req.body.model,
            imageUrl : req.body.imageUrl,
            price : req.body.price,
            stock : req.body.stock
        }
    );
    product.save().then((createdProduct)=>
    {
        console.log('Success!')
res.status(201).json(createdProduct)
    }).catch((err)=>
    { console.log('The error')
        res.status(500).json(
            {
                error: err,
                success: false
            }
        )
    })
});

router.delete (`/:id`, (req, res) => 
    {
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

module.exports = router;