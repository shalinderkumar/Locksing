const Sequelize = require('sequelize');
var AppVersion  = require('../models/app_versions');
var Utils       = require('../utils');


exports.getAppVersion = ((req,cb) => {


	AppVersion.findOne({
		where:{
			app_type:req.app_type
		}
	}).then(app_version_exist=>{
		if(app_version_exist == '' || app_version_exist == null){
			res.send({
				success:0,
				message:"App version not exist."
			})	
		}else{ 
			var version_diff = 0;
			version_diff = parseFloat(app_version_exist.app_version) - parseFloat(req.body.app_version);
			if(parseFloat(version_diff) < 1.0){
				is_force_update = 0;
				is_new_update   = 1;
				if(version_diff == 0){
					is_new_update   = 0;
				}
			}else{
				is_force_update = 1;
				is_new_update   = 1;
			}
			var result = {"force_update":is_force_update,"new_update":is_new_update};	
			cb(null,result);
		}
	})
});
