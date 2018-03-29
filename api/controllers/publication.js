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

		followsClean.push(req.user.sub);

		Publication.find({user: {'$in': followsClean}}).sort([['created_at',-1]]).populate('user')
									.paginate(page, itemsPerPage, (error, publications, total)=>{
			if(error) return res.status(500).send({message: 'Error obteniendo las publicaciones'});

			if(!publications) return res.status(404).send({message: 'No hay publicaciones'});

			return res.status(200).send({
				publications,
				totalItems: total,
				page: page,
				pages: Math.ceil(total/itemsPerPage),
				itemsPerPage: itemsPerPage
			});
		});
	});
}

function getPublication(req, res){
	var publicationId = req.params.id;

	Publication.findById(publicationId, (error, publication)=>{
		if(error) return res.status(500).send({message: 'Error al obtener la publicación'});

		if(!publication) return res.status(404).send({message: 'La publicación no existe!!!'});

		return res.status(200).send({publication});
	});
}

function deletePublication(req, res){
	var publicationId = req.params.id;

	Publication.find({'user': req.user.sub, '_id': publicationId}).remove(error =>{
		if(error) return res.status(500).send({message: 'Error eliminando la publicación'});

		return res.status(200).send({message: 'Publicación eliminada correctamente'});
	});
}

// Subir archivos de imagen/avatar de usuario
function uploadImage(req, res){
	var publicationId = req.params.id;
	if(req.files){
		var filePath = req.files.image.path;
		console.log(filePath);
		var fileSplit = filePath.split(/[\\/]/);
		var fileName = fileSplit.pop();
		var extSplit = fileName.split('\.');
		var ext = '';
		if(extSplit.length > 1)
			ext = extSplit.pop();

		if(ext.toLowerCase() == 'png' || ext.toLowerCase() == 'jpg' || ext.toLowerCase() == 'gif' || ext.toLowerCase() == 'jpeg'){

			Publication.findOne({'user': req.user.sub, '_id': publicationId}).exec((error, publication)=> {
				if(publication){
					Publication.findByIdAndUpdate(publicationId, {file: fileName}, {new: true}, (error, publicationUpdated)=>{
						if(error) 
							return removeFilesOfUploads(res, filePath, 'Error en la petición', 500);

						if(!publicationUpdated) 
							return removeFilesOfUploads(res, filePath, 'No se pudo actualizar la publicación', 500);

						return res.status(200).send({publication: publicationUpdated});

					});
				}else{
					return removeFilesOfUploads(res, filePath, 'No tiene permiso para actualizar esta publicación', 200);
				}
			});	
		}else{
			return removeFilesOfUploads(res, filePath, 'Extensión de imagen invalida', 200);
		}
	}else{
		return res.status(200).send({message: 'No se han subido imagenes'});
	}
}

function removeFilesOfUploads(res, filePath, message, status){
	fs.unlink(filePath, (error)=> {
		return res.status(status).send({message: message});
	});
}


function getImageFile(req, res){
	var imageFile = req.params.imageFile;
	var pathImage = './uploads/publications/' + imageFile;
	fs.exists(pathImage, (exists)=>{
		console.log(pathImage);
		if(exists){			
			return res.sendFile(path.resolve(pathImage));
		}else{
			return res.status(404).send({message: 'No existe la imagen ...'});
		}
	});
}

module.exports = {
	prueba,
	savePublication,
	getPublications,
	getPublication,
	deletePublication,
	uploadImage,
	getImageFile
}