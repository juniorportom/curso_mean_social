'use strict'

var User = require('../models/user');

var bcrypt = require('bcrypt-nodejs');

var jwt = require('../services/jwt');

var mongoosePaginate = require('mongoose-pagination');

var fs = require('fs');  // Libreria de file systemn de Node

var pasth = require('path');  //Libreria para el manejo de rutas

function home (req, res){
	res.status(200).send({
		message: 'Hola mundo desde el servidor de NodeJS'
	});
}

function pruebas(req, res){
	//console.log(res.body);
	res.status(200).send({
		message: 'Acción de pruebas en el servidor de NodeJS'
	});
}


// Registro de usuarios
function saveUser(req, res){
	var params = req.body;
	var user = new User();

	if(params.name && params.surname && params.nick
		&& params.email && params.password){
		user.name = params.name;
		user.surname = params.surname;
		user.nick = params.nick;
		user.email = params.email;
		user.role = 'ROLE_USER';
		user.image = null;

		// Controlar usuarios duplicados

		User.find({
			$or: [
				{email: user.email.toLowerCase()},
				{nick: user.nick.toLowerCase()}
			]
		}).exec((error, users)=>{
			if(error) return res.status(500).send({message: 'Error en la petición de usuarios'});

			if(users && users.length > 0){
				return res.status(200).send({message: 'El usuario que intentas registrar ya existe !!'});
			}else{
				// Cifrado de contraseña y almacenamiento de usuario
				bcrypt.hash(params.password, null, null, (error, hash) =>{
				user.password = hash;

				user.save((error, userStored) => {
					if(error) return res.status(500).send({message: 'Error al guardar el usuario'});

					if(userStored){
						res.status(200).send({
							user: userStored
						});
					}else{
						res.status(404).send({
							message: 'No se ha registrado el usuario'
						});
					}
				});

			})
		}

		});		

	}else{
		res.status(200).send({
			message: 'Envia todos los campos necesarios!!'
		});
	}
}


//Login de usuario
function loginUser(req, res){
	var params = req.body;

	var email = params.email;
	var password = params.password;

	User.findOne({email}, (error, user)=>{
		if(error) return res.status(500).send({message: 'Error en la petición'});

		if(user){
			bcrypt.compare(password, user.password, (error, check) =>{
				if(check){

					if(params.gettoken){
						//Generar y Devolver token
						return res.status(200).send({
							token: jwt.createToken(user)
						});

					}else{
						//devolver datos de usurio
						user.password = undefined; // Eliminar propiedades de la respuesta
						res.status(200).send({user});
					}					
				}else{
					res.status(404).send({message: 'El usuario no se ha podido identificar'});
				}
			});
		}else{
			res.status(404).send({message: 'El usuario no se ha podido identificar !!'});
		}
	});
}

// Conseguir datos del usuario
function getUser(req, res){
	var userId = req.params.id;

	User.findById(userId, (error, user)=>{
		if(error) return res.status(500).send({message: 'Error en la petición'});

		if(!user) return res.status(404).send({message: 'Usuario no existe'});

		return res.status(200).send({user});

	});
}

// Devolver un listado de usuarios paginados
function getUsers(req, res){
	var identityUserId = req.user.sub;
	var page = 1;
	if(req.params.page){
		page = req.params.page;
	}

	var itemsPerPage = 5;

	User.find().sort('_id').paginate(page, itemsPerPage, (error, users, total)=>{
		if (error) return res.status(500).send({message: 'Error en la petición'});

		if(!users) return res.status(404).send({message: 'No hay usuarios disponibles'});

		return res.status(200).send({
			users,
			total,
			pages: Math.ceil(total/itemsPerPage)
		});
	});
}

// Edición de datos de usuario
function updateUser(req, res){
	var userId = req.params.id;
	var update = req.body;

	// Borrar propiedad password
	delete update.password;
	if(userId != req.user.sub)
		return  res.status(500).send({
			message: 'No tienes permiso para actualizar los datos del usuario'
		});

	User.findByIdAndUpdate(userId, update, {new: true} ,(error, userUpdated)=>{
		if(error) return res.status(500).send({message: 'Error en la petición'});

		if(!userUpdated) return res.status(404).sebd({message: 'No se ha podido actualizar el usuario'});

		return res.status(200).send({user:userUpdated});
	});
}

// Subir archivos de imagen/avatar de usuario
function uploadImage(req, res){
	var userId = req.params.id;
	if(req.files){
		var filePath = req.files.image.path;
		console.log(filePath);
		var fileSplit = filePath.split(/[\\/]/);
		var fileName = fileSplit.pop();
		var extSplit = fileName.split('\.');
		var ext = '';
		if(extSplit.length > 1)
			ext = extSplit.pop();
		console.log(ext);

		if(userId != req.user.sub){
			
			return removeFilesOfUploads(res, filePath, 'No tienes permiso para actualizar los datos del usuario', 500);			
		}

		if(ext.toLowerCase() == 'png' || ext.toLowerCase() == 'jpg' || ext.toLowerCase() == 'gif' || ext.toLowerCase() == 'jpeg'){
			User.findByIdAndUpdate(userId, {image: fileName}, {new: true}, (error, userUpdate)=>{
				if(error) 
					return removeFilesOfUploads(res, filePath, 'Error en la petición', 500);

				if(!userUpdate) 
					return removeFilesOfUploads(res, filePath, 'No se pudo actualizar el usuario', 500);

				return res.status(200).send({user: userUpdate});

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


module.exports = {
	home,
	pruebas,
	saveUser,
	loginUser,
	getUser,
	getUsers,
	updateUser,
	uploadImage
}

