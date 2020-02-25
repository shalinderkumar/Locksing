const jwt = require('jsonwebtoken');
const async = require("async");
// const Constants = require('../constants');
var setToken = function(req,callback){
	const token = jwt.sign({ id:req.id,type:req.type }, "secret_key_goes_here");
	callback(null,token);
};

var verifyToken = function(req,res){
	const token = jwt.verify(req,"secret_key_goes_here");
	return token;
};

module.exports = {
	setToken:setToken,
	verifyToken:verifyToken,
}