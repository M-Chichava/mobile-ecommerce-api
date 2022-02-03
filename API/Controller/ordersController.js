const {Order} = require('../../Domain/order');
const express = require('express');
const orderRouter = express.Router();


orderRouter.get(`/`, async (req, res) =>{
    const orderList = await Order.find();

    if(!orderList)
    {
        res.status(500).json({
            success: false
        })
    }
    res.send(orderList)
});


orderRouter.post(`/`, async (req, res) =>{
    const order = new Order(
        {
            name : req.body.name,
            brand : req.body.brand,
            model : req.body.model,
            imageUrl : req.body.imageUrl,
            price : req.body.price,
            stock : req.body.stock
        }
    );
    order.save().then((createdOrder)=>
    {
        console.log('Success!')
res.status(201).json(createdOrder)
    }).catch((err)=>
    { console.log('The error')
        res.status(500).json(
            {
                error: err,
                success: false
            }
        )
    })
})

module.exports = orderRouter;