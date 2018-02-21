'use strict'

var express = require('express');

var FollowController = require('../controllers/follow');

var api = express.Router();

var mdAuth = require('../middlewares/authenticated');

api.get('/pruebas-follow', mdAuth.ensureAuth, FollowController.prueba);
api.post('/follow', mdAuth.ensureAuth, FollowController.saveFollow);
api.delete('/follow/:id', mdAuth.ensureAuth, FollowController.deleteFollow);
api.get('/following/:id?/:page?', mdAuth.ensureAuth, FollowController.getFollowingUsers);

module.exports = api;