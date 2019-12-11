const Product = require('../models/productModel');
const jsonData = require('../utils/json_reader');

exports.indexAction = (req, res, next) => {
    const promise = jsonData.jsonReader('./data/index_carousel.json');
    
    promise.then((value) =>{
        console.log(value);
        res.render('customer_views/index', {
            pageTitle: "Home",
            path: '/',
            meta: value
        })
    });
};

exports.cartAction = (req, res, next) => {
    // Product.getProductsFromTheCart(13550)
    // .then((data)=>{
    //     console.log('data:' ,data[0]);
    // }).catch(err=>{console.log(err)})
    const fetchProducts = ()=>{
        return new Promise((resolve,reject)=>{
             resolve((Product.getProductsFromTheCart(13550)))
        })
        // return promise
    }
     
    fetchProducts()
        .then((result)=>{
            console.log(result[0])
            res.render('customer_views/cart',{
                pageTitle: "Cart",
                path: "/cart",
            })
        }).catch(err=>console.error(err))
    
};