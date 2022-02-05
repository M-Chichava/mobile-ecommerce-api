const {User} = require('../../Domain/user');
const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const router = express.Router();


router.get(`/list`, async (req, res) =>
    {
        const usersList = await User.find().select('-passwordHash');

        if(!usersList)
        {
            res.status(500).json({
                success: false
            });
        }
        return res.status(200).send(usersList)
    }
);

router.get(`/:id`, async (req, res) =>
    {
        const user = await User.findById(req.params.id).select('-passwordHash');

        if(!user)
        {
            res.status(500).json(
                {
                    message: 'The user with the given Id was not found.'
                }
            )
        }
        return res.status(200).send(
            {
                id : user.id, 
                name : user.name,
                email: user.email,
                phone: user.phone,
                street : user.street,
                apartment : user.apartment,
                zip : user.zip,
                city : user.city,
                country: user.country
            }
        );
    }
)


router.post('/register', async (req,res)=>{
    let user = new User({
        name: req.body.name,
        email: req.body.email,
        passwordHash: bcrypt.hashSync(req.body.passwordHash, 10),
        phone: req.body.phone,
        isAdmin: req.body.isAdmin,
        street: req.body.street,
        apartment: req.body.apartment,
        zip: req.body.zip,
        city: req.body.city,
        country: req.body.country,
    })
    user = await user.save();

    if(!user)
    { 
        return res.status(400).send('the user cannot be created!')
    }

    return res.status(200).send(
        {
            id : user.id, 
            name : user.name,
            email: user.email,
            phone: user.phone,
            street : user.street,
            apartment : user.apartment,
            zip : user.zip,
            city : user.city,
            country: user.country
        }
    );
})


router.post(`/login`, async (req, res) => {
    const user = await User.findOne({email : req.body.email})
    const secret = process.env.SECRET;
    if(!user)
    {
        return res.status(400).send('The Credentials are not matching to get loged in')
    }
    if(user && bcrypt.compareSync(req.body.passwordHash, user.passwordHash))
    {
        const token = jwt.sign(
            {
                userId : user.id
            },
            secret,
            {
                expiresIn : '30s'
            }
        )
        return res.status(200).send(
            {
                token : token, 
                id : user.id, 
                name : user.name,
                email: user.email,
                phone: user.phone,
                street : user.street,
                apartment : user.apartment,
                zip : user.zip,
                city : user.city,
                country: user.country
            }
        );
    }
    else{
        return res.status(400).send('The Credentials are not matching to get loged in')
    }
});

router.delete('/:id', (req, res)=>{
    User.findByIdAndRemove(req.params.id).then(user =>{
        if(user) {
            return res.status(200).json({success: true, message: 'the user is deleted!'})
        } else {
            return res.status(404).json({success: false , message: "user not found!"})
        }
    }).catch(err=>{
       return res.status(500).json({success: false, error: err}) 
    })
})

router.get(`/get/count`, async (req, res) =>{
    const userCount = await User.countDocuments((count) => count)

    if(!userCount) {
        res.status(500).json({success: false})
    } 
    res.send({
        userCount: userCount
    });
})

module.exports = router;