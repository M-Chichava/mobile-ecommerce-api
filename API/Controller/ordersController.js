const {Order} = require('../../Domain/order');
const express = require('express');
const router = express.Router();


router.get(`/`, async (req, res) =>{
    const orderList = await Order.find();

    if(!orderList)
    {
        res.status(500).json({
            success: false
        })
    }
    res.send(orderList)
});


router.get(`/:id`, async (req, res) =>
    {
        const order = await Order.findById(req.params.id);

        if(!order)
        {
            res.status(500).json(
                {
                    message: 'The order with the given Id was not found.'
                }
            )
        }
        res.status(200).send(order);
    }
)


router.post(`/`, async (req, res) =>{

    const order = new Order(
        {
            name  : req.body.name,
            description  : req.body.description,
            richdescription  : req.body.richdescription,
            imagesUrl  : req.body.imagesUrl,
            brand  : req.body.brand,
            price  : req.body.price,
            category  : req.body.category,
            countStock  : req.body.countStock,
            rating  : req.body.req.body.rating,
            numReviews  : req.body.req.body.numReviews,
            isFeatured  : req.body.isFeatured
        }
    );

    order = await order.save()
     
    if(!order)
    {
        return res.status(500).send('The order cannot be created')
    }
    res.send(order);
});

router.put(`/:id`, async (req, res) => 
    {
        const order = await order.findByIdAndUpdate
        ( 
            req.params.id,
            {
                nname  : req.body.name,
                description  : req.body.description,
                richdescription  : req.body.richdescription,
                imagesUrl  : req.body.imagesUrl,
                brand  : req.body.brand,
                price  : req.body.price,
                category  : req.body.category,
                countStock  : req.body.countStock,
                rating  : req.body.req.body.rating,
                numReviews  : req.body.req.body.numReviews,
                isFeatured  : req.body.isFeatured
            },     
            {new: true} 
        )
        if(!order)
            return res.status(404)
            .send('the order cannot be updated!');
        
        res.send(order);
    }
)


router.delete (`/:id`, (req, res) => 
    {
        Order.findByIdAndRemove(req.params.id)
        .then( order =>
            {
                if(order)
                {
                    return res.status(200).json(
                            {
                                success: true,
                                message: 'the order is deleted'
                            }
                        );
                } 
                else
                    {
                        return res.status(404).json(
                            {
                                success: false,
                                message: 'the order was not found'
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