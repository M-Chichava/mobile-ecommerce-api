const mongoose = require('mongoose');


const productSchema = mongoose.Schema({
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
    productImage  : {
        type: String,
        default: ''
    }, 
    productImages  : [{
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
    category  : {
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
    numReviews  : {
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
});

productSchema.virtual('id').get(function(){
    return this._id.toHexString();
});

productSchema.set('toJSON', {
    virtuals: true
});

productSchema.pre('save', function () {
    if(!this.productImage) {
        this.productImage = `${process.env.UR}`
    }
})

exports.Product = mongoose.model('Product', productSchema);