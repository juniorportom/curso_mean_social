'use strict'

var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var FollowSchema = Schema({
	user: {tyoe: Schema.ObjectId, ref: 'User'},
	followed: {tyoe: Schema.ObjectId, ref: 'User'}
});

module.exports = mongoose.model('Follow', FollowSchema);
