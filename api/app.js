'use strict'

var express = require('express');
var bodyParser = require('body-parser');

var app = express();

// cargar rutas 

var userRoutes = require('./routes/user');

//middlewares

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

//cors

//rutas
app.use('/api', userRoutes);

//exportar
module.exports = app;