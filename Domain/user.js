const mongoose = require('mongoose');
const { Category } = require('./category');


const userSchema = mongoose.Schema({
    name  : {
        type: String,
        required: true
    },
    description  : {
        type: String,
        required: true
    },
    richdescription  : {
        type: String,
        default: ''
    },
    imagesUrl  : [{
        type: String
    }],  
    brand  : {
        type: String,
        default: ''
    }, 
    price  : {
        type: Number,
        default: 0,
    },
    caregory  : {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
        required: true,
    },
    countStock  : {
        type: Number,
        required: true,
        min: 0,
        max: 255,
    },
    rating  : {
        type: Number,
        default: 0,
    },
    isFeatured  : {
        type: Boolean,
        default: false,
    },
    dateCreated  : {
        type: Date,
        default: Date.now,
    }
})


exports.User = mongoose.model('User', userSchema);