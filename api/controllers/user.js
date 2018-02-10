'use strict'

var User = require('../models/user');

var bcrypt = require('bcrypt-nodejs');

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

module.exports = {
	home,
	pruebas,
	saveUser
}