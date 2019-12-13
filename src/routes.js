const express = require('express');
const multer = require('multer');
const uploadConfig = require('./config/upload');
const UserController = require('./controllers/UserController');
const ProductController = require('./controllers/ProductController');
const DashboardController = require('./controllers/DashboardController');
const ProductIdController = require('./controllers/ProductIdController');
const routes = express.Router();
const passport = require('passport');

const upload = multer(uploadConfig);

routes.post('/signup', UserController.store);
routes.post('/login', UserController.login);

routes.post('/products', upload.single('thumbnail'), ProductController.store);
routes.get('/products/list', passport.authenticate('jwt'), ProductController.index);

routes.get('/', DashboardController.show);
routes.post('/products/:product_id', ProductIdController.store);

module.exports = routes;