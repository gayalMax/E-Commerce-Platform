const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const MySQLStore = require('express-mysql-session')(session);
const csrf = require('csurf');

const adminRoutes = require('./routes/adminRouter');
const homeRoutes = require('./routes/homeRouter');
const authRoutes = require('./routes/authRouter');

const errorController = require('./controllers/errorController');
const config = require('./utils/config');
const Customer = require('./models/customerModel');


const app = express();
const csrfProtection = csrf();

app.set('view engine', 'ejs');
app.set('views', 'views');

app.use(bodyParser.urlencoded({extended: false}));
app.use(express.static(path.join(__dirname, 'public'))); 
const sessionStorage = new MySQLStore(config.sessionStorage);
app.use(session({ 
    key: config.sessionDetails['key'],
    secret: config.sessionDetails['secret'],
    store: sessionStorage,
    resave: false, 
    saveUninitialized: false
}));

app.use(csrfProtection);

app.use((req, res, next) => {
    if (!req.session.user) {
        return next();
    } 
    Customer.getCustomerByUsername(req.session.user.username)
        .then (user => {
            req.user = user;
            next();
        }).catch(err => console.log(err));
});

app.use((req, res, next) => {
    res.locals.isAuthenticated = req.session.isLoggedIn;
    res.locals.csrfToken = req.csrfToken();
    next();
});

app.use('/admin', adminRoutes);
app.use(homeRoutes);
app.use(authRoutes);

app.use(errorController.get404);

app.listen(3000);
