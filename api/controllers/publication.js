'use strict'

var path = require('path');
var fs = require('fs');
var moment = require('moment');
var mongoosePaginate = require('mongoose-pagination');

var Publication = require('../models/publication');
var User = require('../models/user');
var Follow = require('../models/follow');

function prueba(req, res){
	res.status(200).send({message: 'Prueba en controlador de publicaciones'});

}

function savePublication(req, res){
	var params = req.body;

	if(!params.text){
		return res.status(200).send({message: 'Debes enviar un texto!!'});
	}

	var publication = new Publication();
	publication.text = params.text;
	publication.file = null;
	publication.user = req.user.sub;
	publication.created_at = moment().unix();

	publication.save((error, publicationStored)=>{
		if(error) return res.status(500).send({message: 'Error al guardar la publicación'});

		if(!publicationStored) return res.status(404).send({message: 'La publicación no ha sido guardada'});

		return res.status(200).send({publication: publicationStored});
	});
}

function getPublications(req, res){
	var page = 1;

	if (req.params.page){
		page = req.params.page;
	}

	var itemsPerPage = 4; 

	Follow.find({user: req.user.sub}).populate('followed').exec((error, follows)=>{
		if(error) return res.sttua(500).send({message: 'Error obteniendo los seguimientos'});

		var followsClean = [];

		follows.forEach((follow)=>{
			followsClean.push(follow.followed);
		})

		Publication.find({user: {'$in': followsClean}}).sort('create_at').populate('user').paginate(page, itemsPerPage, (error, publications, total)=>{
			if(error) return res.status(500).send({message: 'Error obteniendo las publicaciones'});

			if(!publications) return res.status(404).send({message: 'No hay publicaciones'});

			return res.status(200).send({
				publications,
				totalItems: total,
				page: page,
				pages: Math.ceil(total/itemsPerPage)
			});
		});
	});
}

module.exports = {
	prueba,
	savePublication,
	getPublications
}