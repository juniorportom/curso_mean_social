'use strict'

var express = require('express');

var MessageController = require('../controllers/message');

var api = express.Router();

var mdAuth = require('../middlewares/authenticated');

api.get('/prueba-message', MessageController.prueba);
api.post('/message', mdAuth.ensureAuth, MessageController.saveMessage);
api.get('/my-messages/:page?', mdAuth.ensureAuth, MessageController.getReceivedMessages);
api.get('/messages/:page?', mdAuth.ensureAuth, MessageController.getEmittedMessages);
api.get('/unviewed-messages', mdAuth.ensureAuth, MessageController.getUnviewedMessages);
api.get('/set-viewed-messages', mdAuth.ensureAuth, MessageController.setViewedMessages);

module.exports = api;