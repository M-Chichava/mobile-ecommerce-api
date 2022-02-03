const {User} = require('../../Domain/user');
const express = require('express');
const userRouter = express.Router();


userRouter.get(`/`, async (req, res) =>{
    const userList = await User.find();

    if(!userList)
    {
        res.status(500).json({
            success: false
        })
    }
    res.send(userList)
});


userRouter.post(`/`, (req, res) =>{
    const user = new User(
        {
            name : req.body.name,
            brand : req.body.brand,
            model : req.body.model,
            imageUrl : req.body.imageUrl,
            price : req.body.price,
            stock : req.body.stock
        }
    );
    user.save().then((createduser)=>
    {
        console.log('Success!')
res.status(201).json(createduser)
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

module.exports = userRouter;