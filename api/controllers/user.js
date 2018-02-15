'use strict'

var User = require('../models/user');

var bcrypt = require('bcrypt-nodejs');

var jwt = require('../services/jwt');

var mongoosePaginate = require('mongoose-pagination');

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

module.exports = {
	home,
	pruebas,
	saveUser,
	loginUser,
	getUser,
	getUsers
}

