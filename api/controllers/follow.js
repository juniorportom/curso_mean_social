'use strict'

//var path = require('path');

//var fs = require('fs');

var mongoosePaginate = require('mongoose-pagination');

var User = require('../models/user');

var Follow = require('../models/follow');

function prueba(req, res){
	return res.status(200).send({message: 'Hola mundo desde el controlador de follows'});
}

function saveFollow(req, res){
	var params = req.body;
	var follow = new Follow();
	
	follow.user = req.user.sub;
	follow.followed = params.followed;

	follow.save((error, followStored)=>{
		if(error) return res.status(500).send({message: 'Error al guardar el seguimiento'});

		if(!followStored) return res.status(404).send({message: 'El seguimiento no se ha guardado'});

		return res.status(200).send({follow: followStored});
	});
}

function deleteFollow(req, res){
	var userId = req.user.sub;

	var followId = req.params.id;

	Follow.find({'user': userId, 'followed': followId}).remove((error)=>{
		if(error) return res.status(500).send({message: 'Error al dejar de seguir'});

		return res.status(200).send({message: 'El follow se ha eliminado!!'});
	});
}

function getFollowingUsers(req, res){
	var userId = req.user.sub;
	var page = 1;
	var itemsPerPage = 4;

	if(req.params.id && req.params.page){
		userId = req.params.id;
	}

	if(req.params.page){
		page = req.params.page;
	}else{
		page = req.params.id;
	}


	Follow.find({user: userId}).populate({path: 'followed'}).paginate(page, itemsPerPage, (error, follows, total)=>{
		if(error) return res.status(500).send({message: 'Error en la petición'});

		if(!follows) return res.status(404).send({message: 'No estas siguiendo a ningun usuario'});

		followUserIds(userId).then((value)=>{
			return res.status(200).send({
				total: total,
				pages: Math.ceil(total/itemsPerPage),
				follows,
				usersFollowing: value.following,
				usersFollowMe: value.followed
			});
		});		
	})
}

function getFollowedUsers(req, res){
	var userId = req.user.sub;
	var page = 1;
	var itemsPerPage = 4;

	if(req.params.id && req.params.page){
		userId = req.params.id;
	}

	if(req.params.page){
		page = req.params.page;
	}else{
		page = req.params.id;
	}


	Follow.find({followed: userId}).populate('user followed').paginate(page, itemsPerPage, (error, follows, total)=>{
		if(error) return res.status(500).send({message: 'Error en la petición'});

		if(!follows) return res.status(404).send({message: 'No te sigue ningun usuario'});

		followUserIds(userId).then((value)=>{
			return res.status(200).send({
				total: total,
				pages: Math.ceil(total/itemsPerPage),
				follows,
				usersFollowing: value.following,
				usersFollowMe: value.followed
			});
		});	
	})
}


//devolver usuarios que sigo
function getMyFollows(req, res){
	var userId = req.user.sub;

	var find = Follow.find({user: userId});

	if(req.params.followed){
		find = Follow.find({followed: userId});
	}


	find.populate('user followed').exec((error, follows)=>{
		if(error) return res.status(500).send({message: 'Error en la petición'});

		if(!follows) return res.status(404).send({message: 'No estas siguiendo a ningun usuario'});

		return res.status(200).send({ follows });
	})
}

async function followUserIds(userId){
	try{
		var following = await Follow.find({'user':userId}).select({'_id':0, '__v':0, 'user': 0}).exec()
		.then((follows)=>{			
			return follows;
		})
		.catch((err)=>{
                return handleError(err);
            });

		var followed = await Follow.find({'followed':userId}).select({'_id':0, '__v':0, 'followed': 0})
		.exec().then((follows)=>{			
			return follows;
		})
		.catch((err)=>{
                return handleError(err);
            });

		var followingsClean = [];

		if(following){
			following.forEach((follow)=>{
				followingsClean.push(follow.followed);			
			});
		}

		var followedsClean = [];

		if(followed){
			console.log(followed);
			followed.forEach((follow)=>{
				followedsClean.push(follow.user);			
			});
		}

		return {
			following: followingsClean,
			followed: followedsClean
		}
	}catch(e){
		console.log(e);
	}	
}


module.exports = {
	prueba,
	saveFollow,
	deleteFollow,
	getFollowingUsers,
	getFollowedUsers,
	getMyFollows
}






