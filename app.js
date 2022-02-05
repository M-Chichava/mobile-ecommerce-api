//Imports
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const morgan = require('morgan');
const mongoose = require('mongoose');
const Product = require('./Domain/product');
const Category = require('./Domain/category');
const Order = require('./Domain/order');
const User = require('./Domain/user');
const productsController = require('./API/Controller/productsController');
const categoriesController= require('./API/Controller/categoriesController');
const ordersController = require('./API/Controller/ordersController');
const usersController = require('./API/Controller/usersController');
const authJwt = require('./API/Helper/jwt');
const cors = require('cors');

require('dotenv/config');

//enable Cors allowing all HTTP Request
app.use(cors());
app.options('*', cors())

// Eviroment Variables
const port = process.env.SERVER_PORT;
const api = process.env.API_URL;
const connectioString = process.env.CONNECTION_STRING

//Middleware section
app.use(bodyParser.json());
app.use(morgan('tiny'));
app.use(authJwt());

app.use(`${api}/products`, productsController)
app.use(`${api}/categories`, categoriesController)
app.use(`${api}/orders`, ordersController)
app.use(`${api}/users`, usersController)


mongoose.connect(connectioString)
.then(()=>{
    console.log('Database was Successfuly Connected!')
})
.catch((err)=>{
    console.log(err,'\n:Thats the error');
})

app.listen(port, ()=> {
    console.log(`Mobile API now listening on: http://localhost:${port}`);
})