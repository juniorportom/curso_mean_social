'use strict'

var express = require('express');

var PublicationController = require('../controllers/publication');

var api = express.Router();

var mdAuth = require('../middlewares/authenticated');

var multipart = require('connect-multiparty');

var mdUpload = multipart({uploadDir: './uploads/publications'});

api.get('/prueba-publication', mdAuth.ensureAuth, PublicationController.prueba);
api.post('/save-publication', mdAuth.ensureAuth, PublicationController.savePublication);
api.get('/publications/:page?', mdAuth.ensureAuth, PublicationController.getPublications);

module.exports = api;
