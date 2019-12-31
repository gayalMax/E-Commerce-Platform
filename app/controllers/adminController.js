const Product = require('../models/productModel');
const Order = require('../models/orderModel');
const Category = require('../models/categoryModel');
const jsonData = require('../utils/json_reader');
const Report = require('../models/reportModel');

exports.admin_dashboardAction = (req, res, next) => {
    res.render('admin_views/admin_dashboard', {
        pageTitle: "Admin Dashboard",
        path: '/',
        isAuthenticated: req.session.isLoggedIn
    });
}

exports.view_categoryAction = (req, res, next) => {
    res.render('admin_views/view_category', {
        pageTitle: "View Category",
        path: '/',
        isAuthenticated: req.session.isLoggedIn
    });
}

exports.view_productAction = (req, res, next) => {
    res.render('admin_views/view_product', {
        pageTitle: "View Category",
        path: '/',
        isAuthenticated: req.session.isLoggedIn
    });
}

exports.reportAction = (req, res, next) => {
    res.render('admin_views/report', {
        pageTitle: "Admin Dashboard",
        path: '/',
        isAuthenticated: req.session.isLoggedIn
    });
}

exports.top_sold_productsAction = (req, res, next) => {

    var end_date = new Date().toISOString().slice(0, 10);
    var start_date = new Date(new Date().setDate(new Date().getDate() - 30)).toISOString().slice(0, 10);

    const fetchTopSoldProducts = () => {
        return new Promise((resolve, reject) => {
            resolve((Report.getTopSoldProducts(start_date, end_date)));
        });
    };

    fetchTopSoldProducts().then((result) => {

        res.render('admin_views/top_sold_products', {
            pageTitle: "Admin Dashboard",
            path: '/',
            isAuthenticated: req.session.isLoggedIn,
            table: result[0],
            reportText: "Top sales from " + start_date + " to " + end_date
        })
    });
}

exports.top_sold_productsPOSTAction = (req, res, next) => {

    const fetchTopSoldProducts = () => {
        return new Promise((resolve, reject) => {
            resolve((Report.getTopSoldProducts(req.body.start_date, req.body.end_date)));
        });
    };

    fetchTopSoldProducts().then((result) => {

        res.render('admin_views/top_sold_products', {
            pageTitle: "Admin Dashboard",
            path: '/',
            isAuthenticated: req.session.isLoggedIn,
            table: result[0],
            reportText: "Top sales from " + req.body.start_date + " to " + req.body.end_date
        })
    });


}

exports.addProductAction = (req, res, next) => {
    const fetchCategoryDetails = () => {
        return new Promise((resolve, reject) => {
            resolve(Category.fetchAllCategoryIDAndCategory());
        });
    };

    fetchCategoryDetails().then((result) => {
        console.log(result);
        res.render('admin_views/add-product', {
            pageTitle: "Add Product",
            path: '/',
            category: result,
            isAuthenticated: req.session.isLoggedIn
        });
    });


}

exports.addProductPostAction = (req, res, next) => {
    console.log(req.body);

    const fetchCategoryDetails = () => {
        return new Promise((resolve, reject) => {
            resolve(Category.fetchAllCategoryIDAndCategory());
        });
    };

    fetchCategoryDetails().then((result) => {
        // console.log(result);

        Product.addProduct(req.body);
        res.render('admin_views/add-product', {
            pageTitle: "Add Product",
            path: '/',
            category: result,
            isAuthenticated: req.session.isLoggedIn
        });
    });
}

exports.addCategoryAction = (req, res, next) => {
    const fetchCategoryDetails = () => {
        return new Promise((resolve, reject) => {
            resolve(Category.fetchAllCategoryIDAndCategory());
        });
    };

    fetchCategoryDetails().then((result) => {
        console.log(result);
        res.render('admin_views/add_category', {
            pageTitle: "Add Category",
            path: '/',
            category: result,
            isAuthenticated: req.session.isLoggedIn
        });
    });


}

exports.addCategoryPostAction = (req, res, next) => {
 
    const fetchCategoryDetails = () => {
        return new Promise((resolve, reject) => {
            resolve(Category.fetchAllCategoryIDAndCategory());
        });
    };

    const addProductCategory = () => {
        return new Promise((resolve, reject) => {

            resolve(Category.addProductCategory(req.body.category, req.body.title));
        });
    };

    addProductCategory().then(() => {
        fetchCategoryDetails().then((result) => {
        
            res.render('admin_views/add_category', {
                pageTitle: "Add Category",
                path: '/',
                category: result,
                isAuthenticated: req.session.isLoggedIn
            });
        });
    });

}