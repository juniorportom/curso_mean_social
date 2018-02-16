'use strinct'

var express = require('express');
var UserController = require('../controllers/user');

var mdAuth = require('../middlewares/authenticated');

var api = express.Router();

api.get('/home', UserController.home);
api.get('/pruebas', mdAuth.ensureAuth, UserController.pruebas);
api.post('/register', UserController.saveUser);
api.post('/login', UserController.loginUser);
api.get('/user/:id', mdAuth.ensureAuth, UserController.getUser);
api.get('/users/:page?', mdAuth.ensureAuth, UserController.getUsers);
api.put('/update-user/:id', mdAuth.ensureAuth, UserController.updateUser);

module.exports = api;

