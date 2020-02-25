const Sequelize   = require('sequelize');
var User          = require('../models/users');
var UserSession   = require('../models/user_sessions');
var UserSignature = require('../models/user_signatures');
var Document      = require('../models/documents');
var DocumentUser = require('../models/document_users');
var Admin         = require('../models/admin');
var CMS           = require('../models/cms');
var Utils         = require('../utils');
var _ = require('underscore');

const Op          = Sequelize.Op;

let limit  = 10;   // number of records per page
let offset = 0;

exports.getUser = ((req,cb) => {
	// User.findOne(req)
	User.findOne({
		where:req
	})
	.then(result => {
		cb(null,result);
	}) 
	.catch(function(err){
		cb(err);
	});
});

exports.searchUser = ((req,user_id,cb) => {
	// console.log(req.email)
	User.findAll({
		where:{
		  /*[Op.or]: [
		    {*/
		        email: {
		        	[Op.like]: req.email+'%'
		        },
		        id: {
		        	[Op.ne]: user_id
		        }
		    /*}
		  ]*/
		},
		attributes:['id','name','image','email']
	})
	.then(result => {
		// console.log(result);
		cb(null,result);
	}) 
	.catch(function(err){
		cb(err);
	});
});

exports.getUserdet = ((req,cb) => {
	//console.log("req=======",req);
	User.findOne({
		where:{
			password_reset_token:req.password_reset_token
		}
	})
	.then(result => {
		console.log("User Data",result);
		cb(null,result);
	}) 
	.catch(function(err){
		cb(err);
		//console.log(err)
	});
});

exports.getSignature = ((id,cb) => {
	
	UserSignature.findAll({
			where:{
				user_id:id,
				document_type:'0'	
			}
		})
	.then(result => {
		
		cb(null,result);
	})
	.catch(function(err){
		cb(err);
		
	});
});

exports.createUser = ((req,cb) => {
	User.create(req).then(result => { 
	  	cb(null,result);
	}).catch(function (err) {		
		cb(err);
	});
});

exports.createbulkUser = ((req,cb) => {

	/*let user_email_array = [ 
		{ 'email': 'shalinder@gmail.com' },
		{ 'email': 'varinder@gmail.com' },
		{ 'email': 'shalinder.k@applify.co' } 
	]*/
	// console.log(req);
	let result = '';
	for(let i in req){
		User.create({
			email:req[i]
		}).then(result => { 
			console.log("result==",result);	
		})
	}
	cb(null,result);
	// User.bulkCreate(req)
	// .then(result => { 
	// console.log("createUser============",result);
	// }).catch(function (err) {		
		// cb(err);
	// });
});


/*Model.bulkCreate(req,{ individualHooks: true })
.then(function() {
  return Model.findAll()
})
.then(function(response){
    res.json(response);
})
.catch(function(error){
    res.json(error);
})*/

exports.updateUserProfile = ((req,access_token,cb) => {
	// console.log("req==",req);
	// console.log("access_token==",access_token);
	User.findOne({
	where:{
		access_token:access_token
		}
	}).then(result => { console.log(result);
		result.update(req).then(updated_result=>{
		  	cb(null,updated_result);
		}).catch(function (err) {		
			cb(err);
		});
	}).catch(function (err) {		
		cb(err);
	});
});

exports.resendEmail = ((req,email,cb) => {
	// console.log("req===",access_token);
	User.findOne({
	where:{
		email:email
		},
		// attributes:['id','name','image','country_code']
	}).then(result => { //console.log(result);
		result.update(req).then(updated_result=>{
	console.log("updated_result===",updated_result);
		  	cb(null,updated_result);
		}).catch(function (err) {		
	console.log("err===",err);
			cb(err);
		});
	}).catch(function (err) {		
		cb(err);
	});
});

exports.createUserSession = ((req,cb) => {
	UserSession.create(req).then(result => { //console.log(result);
	  	cb(null,result);
	}).catch(function (err) {		
		cb(err);
	});
});


exports.assignDocumentToUser = ((req,document_id,user_ids_array,user_id,cb) => {
	
	console.log('req.user_ids===',user_ids_array);
	console.log('user_id===',user_id);
	if(req.user_ids){
		//if(req.user_ids.length){
		// let users_array = req.user_ids;
		let sign_status = 0;
        let is_owner    = 0;
		for(let i in user_ids_array){

			if(+user_id == +user_ids_array[i]){
				sign_status = 1;
	            is_owner = 1;
			}

			DocumentUser.create({
				'document_id':document_id || null,
	            'user_id':user_ids_array[i] || null,
	            "sign_status":sign_status,
	            "is_owner":is_owner
			})
			.then(result => { //console.log(result);
			  	console.log(result);
			}).catch(function (err) {		
				cb(err);
			});
		}
	  	cb(null,user_ids_array);
	}else{
		for(let i in user_ids_array){
			DocumentUser.create({
				'document_id':document_id || null,
	            'user_id':user_ids_array[i] || null,
	            'sign_status':1,
	            'is_owner':1
			})
			.then(result => { //console.log(result);
			  	console.log(result);
			}).catch(function (err) {		
				cb(err);
			});
		}
		//let result = 
	  	cb(null,user_ids_array);
	}
});



exports.createSignature = ((req,cb) => {
	UserSignature.create(req).then(result => { //console.log(result);
	  	cb(null,result);
	}).catch(function (err) {		
		cb(err);
	});
});

exports.updatePassword = ((req,email,cb) => {
	User.findOne({
	where:{
		email:email
		},
	}).then(result => { console.log(result);
		result.update(req).then(updated_result=>{
		  	cb(null,updated_result);
		}).catch(function (err) {		
			cb(err);
		});
	}).catch(function (err) {		
		cb(err);
	});
});

exports.changePassword = ((req,token,cb) => {

	User.findOne({
		where:{
			password_reset_token:token
		}
	}).then(result => { //console.log("password_reset_token",result);
		result.update({
			password:req.password,
			password_reset_token:req.password_reset_token
		}).then(updated_result=>{
		  	//console.log(updated_result);
		  	cb(null,updated_result);
		}).catch(function (err) {		
			cb(err);
		});
	}).catch(function (err) {		
		cb(err);
	});
});

User.hasMany(UserSignature,{
	foreignKey:"user_id",
	as:"UserSignatures"
});


// commented on 05/07/2019 by Shalinder
exports.getUserInfo = ((req,cb) => {
	
	console.log("req==",req);
	User.findOne({
		where:req,
		include:
		{
			model:UserSignature,
			as:"UserSignatures",
			required:false
		}
	})
	.then(result => {
		cb(null,result);
		console.log("get users info result",result);
	})
	.catch(function(err){
		cb(err);
		//console.log(err)
	});
});

/*exports.getUserInfo = ((req,cb) => {
	
	console.log("req=======",req);
	User.findOne({
		req,
		include:
		{
			model:UserSignature,
			as:"UserSignatures",
			required:false
		}
	})
	.then(result => {
		cb(null,result);
		console.log("get users info result",result);
	})
	.catch(function(err){
		cb(err);
		//console.log(err)
	});
});
*/

exports.deleteSignature = ((req,cb)=>{

	console.log("deleteSignature",req.id);
	UserSignature.destroy({
		where:{
			id:req.id
		}
	}).then(device_removed=>{
		cb(null,device_removed)
	}).catch(function(err){
		cb(err);
	});
})

exports.primarySignature = ((req,cb)=>{

	UserSignature.findOne({
		where:{
			id:req.id
		}
	})
	.then(user_signature=>{
        user_signature.update({
           is_primary:"1"   //1=primary
        }).then(primary_added=>{
        	console.log('primary_added',primary_added);
        	cb(null,primary_added);
        }).catch(function(err){
        	cb(err);
        })
	})
	.catch(function(err){
    	cb(err);
    });
})

exports.getDocument = ((id,document_type,cb) => {

	UserSignature.findAll({
			where:{
				user_id:id,
				document_type:document_type	
			}
		})
	.then(result => {
		cb(null,result);
	})
	.catch(function(err){
		cb(err);
	});
});

exports.getUserProfile = ((req,cb) => {


	// changed by shalinder on 05/07/2019
	/*User.findOne({req,
	}).then(result => {
>>>>>>> Stashed changes
		cb(null,result);
	}) 
	.catch(function(err){
		cb(err);
	});*/

	User.findOne({
		where:req,
		attributes:['id','name','first_name','middle_name','last_name','email','secret_key','phone_number','contact_number','dob','house_number','pincode','locality','city','state','country'],
		include:
		{
			model:UserSignature,
			as:"UserSignatures",
			required:false
		}
	})
	.then(result => {
		cb(null,result);
		console.log("get users info result",result);
	})
	.catch(function(err){
		cb(err);
		//console.log(err)
	});
});

exports.createDocument = ((req,cb) => {
	Document.create(req).then(result => { 
	  	cb(null,result);
	}).catch(function (err) {		
		cb(err);
	});
});

exports.getAdminInfo = ((req,cb)=>{

	Admin.findOne().then(result => { 
	  	cb(null,result);
	}).catch(function (err) {		
		cb(err);
	});
})

exports.getCms = ((req,cb)=>{

	CMS.findAll().then(result => { 
	  	cb(null,result);
	}).catch(function (err) {		
		cb(err);
	});
})

exports.findUserData = ((req,cb) => {
	// User.findOne(req)
	User.findOne({
		where:req,
		attributes:['id','name','first_name','middle_name','last_name','email'],
	})
	.then(result => {
		cb(null,result);
	}) 
	.catch(function(err){
		cb(err);
	});
});

DocumentUser.belongsTo(Document,{
	foreignKey:"document_id",
	as:"UserDoc"
});


exports.getDocumentNeedSignature = ((user_id,cb) => {

	DocumentUser.findAll({
		where:{
			user_id:user_id,
			sign_status:0	
		},
		include:
		{
			model:Document,
			as:"UserDoc",
			required:true,
			where:{
				is_completed:0
			},
			attributes:['name','path','unique_id','is_hide','is_favourite','local_doc_id']
		}
	})
	.then(result => {
		cb(null,result);
	})
	.catch(function(err){
		cb(err);
	});
});

Document.hasMany(DocumentUser,{
	foreignKey:"document_id",
	as:"DocumentUser"
});

exports.getDocumentStatus = ((user_id,cb) => {
	// console.log("user_id=============",user_id);
	// need_to_share:1
	Document.findAll({
		where:{
			is_completed:1
		},
		include:
		{   
			model:DocumentUser,
			as:"DocumentUser",
			required:true,
			where:{
				user_id:user_id
			}
		}
	})
	.then(result => {
		console.log("result===",result)
		cb(null,result);
	})
	.catch(function(err){
		cb(err);
	});
});

DocumentUser.belongsTo(User,{
	foreignKey:"user_id",
	as:"userInfo"
});

exports.pendingDocumentSign = ((user_id,cb) => {

	Document.findAll({
		where:{
			user_id:user_id,
			is_completed:0
		},
		include:
		{
			model:DocumentUser,
			as:"DocumentUser",
			required:false,
			where:{
				sign_status:0
			},
			include:
			{
				model:User,
				as:"userInfo",
				required:false,
				attributes:['name','image','email']
			}
		}
	})
	.then(result => {
		console.log("result===",result)
		cb(null,result);
	})
	.catch(function(err){
		cb(err);
	});
});

exports.findUser = ((user_email_array,cb) => {
	User.findAll({
		where:{
	        email:user_email_array
		},
		attributes:['id','email']
	})
	.then(result => {
		cb(null,result);
	}) 
	.catch(function(err){
		cb(err);
	});
});


exports.updateDocument = ((document_id,req,cb) => {
	console.log("updateDocument service",req);
	Document.findOne({
		where:{
			id:document_id
		}
	}).then(result => {
		result.update({
			path:req.path,
			sha_key:req.sha_key
		}).then(updated_result=>{
			DocumentUser.update(
			    { sign_status:1 },
			    { where: { user_id: req.user_id }}
			  );
		  	cb(null,updated_result);
		}).catch(function (err) {		
			cb(err);
		});
	}).catch(function (err) {		
		cb(err);
	});
});

exports.updateDocumentStatus = ((document_id,user_id,cb) => {

	// console.log("updateDocumentStatus",document_id);
	DocumentUser.findAll({
		where:{
			document_id:document_id
		}
	}).then(result => {
		if(result){
			//console.log("updateDocumentStatus===",result);
			let len = result.length;
			let is_completed = 1;
			for(let i in result){
				if(result[i].sign_status == 1 && result[i].user_id != user_id){
					is_completed++;
				}
			}
			//console.log("is_completed",is_completed);

			if(len == is_completed){
				Document.update(
				    { is_completed:1 },
				    { where: { id: document_id }}
				);
			}
			cb(null,result.length);
		}else cb()
	}).catch(function (err) {
	    //console.log('errrrrrrrrr',err)		
		cb(err);
	});			
});


exports.getDocumentUser = ((user_ids_array,cb) => {

	User.findAll({
		where:{
	        id:user_ids_array
		},
		attributes:['email']
	})
	.then(result => {
		cb(null,result);
	}) 
	.catch(function(err){
		cb(err);
	});
});

exports.getRecentDocument = ((req,cb) => {

	Document.findOne({
		where:{
	        id:req.document_id
		},
		attributes:['id','path','sha_key','created_at','updated_at']
	})
	.then(result => {
		cb(null,result);
	}) 
	.catch(function(err){
		cb(err);
	});
});


exports.getAllRecentDocument = ((user_id,cb) => {

	Document.findAll({
		where:{
	        user_id:user_id,
	        is_hide:0,
			[Op.and]: {is_completed: !1}, 
			[Op.and]: {need_to_share: !0} 
		},
		order: [
            ['updated_at', 'DESC']
        ],
		// attributes:['id','path','name','sha_key','created_at','updated_at'],
		include:
		{
			model:DocumentUser,
			as:"DocumentUser",
			required:true,
			where:{
				[Op.and]: {user_id: user_id}, 
				[Op.and]: {sign_status:0},
				[Op.and]: {is_owner:0}
			},
			include:
			{
				model:User,
				as:"userInfo",
				required:false,
				attributes:['name','image','email'],
			}
		}
	})
	.then(result => {
		cb(null,result);
	}) 
	.catch(function(err){
		cb(err);
	});
});

exports.hideDocument = ((req,cb)=>{
 
	Document.update(
	    { is_hide:1 },
	    { where: { id: req.document_id }}
	)
	.then(result => {
		cb(null,result[0]);
	}) 
	.catch(function(err){
		cb(err);
	});
}) 

exports.favouriteDocument = ((req,cb)=>{

	Document.update(
	    { is_favourite:req.status },
	    { where: { id: req.document_id }}
	)
	.then(result => {
		// console.log("result================",result)
		cb(null,result[0]);
	}) 
	.catch(function(err){
		cb(err);
	});
}) 

				/*[Op.and]: {sign_status:0},
				[Op.and]: {is_owner:0}*/
exports.importantDocument = ((user_id,cb)=>{

	Document.findAll({
		where:{
	        user_id:user_id,
	        is_favourite:1,
	        is_hide:0
		},
		include:
		{
			model:DocumentUser,
			as:"DocumentUser",
			required:true,
			include:
			{
				model:User,
				as:"userInfo",
				required:false,
				attributes:['name','image','email'],
			}
		}
	})
	.then(result => {
		let document_ids = _.pluck(result, 'id');
		// console.log("document_ids=======",document_ids);
		// cb(null,result);
		Document.findAll({
			where:{
				id: {
		        	[Op.ne]: document_ids
		        },
		        is_favourite:1,
			},
			include:
			{
				model:DocumentUser,
				as:"DocumentUser",
				required:true,
				where:{
					user_id:user_id
				},
				include:
				{
					model:User,
					as:"userInfo",
					required:false,
					attributes:['name','image','email'],
				}
			}
		})
		.then(results => {
			let finalResult = '';
			if(results){
				finalResult = result.concat(results);
			}else{
				finalResult = result;
			}

			cb(null,finalResult);
		}) 
		.catch(function(err){
			cb(err);
		});
	})
	.catch(function(err){
		cb(err);
	});
}) 

exports.renameFileName = ((req,user_id,cb)=>{

		//console.log(req.owner);
	if(req.owner == 1){
		//console.log("test",req.owner);
		Document.update(
		    { name:req.name },
		    { where: { id: req.document_id }}
		)
		.then(result => {
			cb(null,result);
		}) 
		.catch(function(err){
			cb(err);
		});
	}else{
		//console.log("user_id==",user_id);
		DocumentUser.update(
		    { file_name:req.name },
		    { where: 
		    	{ 
		    		document_id: req.document_id, 
		    		user_id: user_id 
		    	}
		   	}
		)
		.then(result => {
		//console.log("req==",result);
			cb(null,result);
		}) 
		.catch(function(err){
			cb(err);
		});
	}
}) 