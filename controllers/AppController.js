var async = require('async');
var AppService = require('../services/AppService');
var Utils = require('../utils');

var appVersion = function(payloadData, callback){
    
    let condition={email:payloadData.email}
    AppService.getAppVersion(condition,function(err,result){
        if(err){
            console.log(err)
            callback(Utils.AppConstants.STATUS_MSG.ERROR.IMP_ERROR)
        }
        else{
            callback(null,result)
        }
    })
};

module.exports = {
  appVersion: appVersion
};