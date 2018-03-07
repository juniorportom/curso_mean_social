'use strict'

var express = require('express');
var bodyParser = require('body-parser');

var app = express();

// cargar rutas 

var userRoutes = require('./routes/user');

var followRoutes = require('./routes/follow');

var publicationRoutes = require('./routes/publication');

var messageRoutes = require('./routes/message');

//middlewares

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

//cors

//rutas
app.use('/api', userRoutes);
app.use('/api', followRoutes);
app.use('/api', publicationRoutes);
app.use('/api', messageRoutes);
//exportar
module.exports = app;