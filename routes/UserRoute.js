var express = require('express');
var router  = express.Router();
var joi     = require("joi");
var Utils   = require('../utils');
var UserController = require('../controllers/UserController');
var AppController = require('../controllers/AppController');
/* POST User Signup. */
// deviceToken: joi.string().required(),     
// deviceType: joi.string().required()      
router.post('/user/signUp', function (req, res) {
   	var schema = joi.object().keys({
        email: joi.string().email().required(),
        password: joi.string().required(),      
    });
    var result = joi.validate({email:req.body.email,password :req.body.password}, schema);
    if(result.error == null){
     	UserController.signUp(req.body, function(err, data) {
            if(err)res.send(err)
            else res.send(Utils.UniversalFunctions.sendSuccess(Utils.AppConstants.STATUS_MSG.SUCCESS.DEFAULT, data))
        })
    }else { res.send(result.error)}
})

router.post('/user/social/signUp', function (req, res) {
    var schema = joi.object().keys({
        email: joi.string().email().required()
    });
    var result = joi.validate({email:req.body.email}, schema);
    if(result.error == null){ 
        UserController.socialMediaSignUp(req.body, function(err, data) {
            if(err)res.send(err)
            else res.send(Utils.UniversalFunctions.sendSuccess(Utils.AppConstants.STATUS_MSG.SUCCESS.DEFAULT, data))
        })
    }else { res.send(result.error)}
})

router.post('/user/login', function (req, res) {

    var schema = joi.object().keys({
        email: joi.string().email().required(),
        password: joi.string().required(),      
    });
    var result = joi.validate({email:req.body.email,password :req.body.password}, schema);
    if(result.error == null){
        UserController.login(req.body,function(err, data) {
            if(err)res.send(err)
            else res.send(Utils.UniversalFunctions.sendSuccess(Utils.AppConstants.STATUS_MSG.SUCCESS.DEFAULT, data))
        })
    }else { res.send(result.error)}
})

router.post('/user/social/login', function (req, res) {
    
    var schema = joi.object().keys({
        email: joi.string().email().required(),
        social_id: joi.string().required(),      
    });    
    var result = joi.validate({email:req.body.email,social_id :req.body.social_id}, schema);

    if(result.error == null){
        UserController.socialLogin(req.body,function(err, data) {
            if(err)res.send(err)
            else res.send(Utils.UniversalFunctions.sendSuccess(Utils.AppConstants.STATUS_MSG.SUCCESS.DEFAULT, data))
        })
    }else { res.send(result.error)}
})

/*router.post('/user/logout', function (req, res) {
    UserController.logout(req.body,function(err, data) {
        if(err)res.send(err)
        else res.send(Utils.UniversalFunctions.sendSuccess(Utils.AppConstants.STATUS_MSG.SUCCESS.DEFAULT, data))
    })
})*/

router.post('/user/profile', function (req, res){
    // console.log('req_body==',req.body);
    UserController.userProfile(req.body,req.files,function(err, data) {
        if(err)res.send(err)
        else res.send(Utils.UniversalFunctions.sendSuccess(Utils.AppConstants.STATUS_MSG.SUCCESS.DEFAULT, data))
    })
})

router.post('/user/signature', function (req, res) {
    UserController.userSignature(req.body,req.files,function(err, data) {
        if(err)res.send(err)
        else res.send(Utils.UniversalFunctions.sendSuccess(Utils.AppConstants.STATUS_MSG.SUCCESS.DEFAULT, data))
    })
})

router.post('/deleteSignature', function (req, res) {
    UserController.deleteSignature(req.body,function(err, data) {
        if(err)res.send(err)
        else res.send(Utils.UniversalFunctions.sendSuccess(Utils.AppConstants.STATUS_MSG.SUCCESS.DEFAULT, data))
    })
})

router.get('/signatures', function (req, res) {
    UserController.signatures(req.query,function(err, data) {
        if(err)res.send(err)
        else res.send(Utils.UniversalFunctions.sendSuccess(Utils.AppConstants.STATUS_MSG.SUCCESS.DEFAULT, data))
    })
})

router.post('/primarySignature', function (req, res) {
    UserController.primarySignature(req.body,function(err, data) {
        if(err)res.send(err)
        else res.send(Utils.UniversalFunctions.sendSuccess(Utils.AppConstants.STATUS_MSG.SUCCESS.DEFAULT, data))
    })
})

router.post('/user/initial', function (req, res) {
    UserController.userInitial(req.body,req.files,function(err, data) {
        if(err)res.send(err)
        else res.send(Utils.UniversalFunctions.sendSuccess(Utils.AppConstants.STATUS_MSG.SUCCESS.DEFAULT, data))
    })
})

router.post('/deleteInitial', function (req, res) {
    UserController.deleteInitial(req.body,function(err, data) {
        if(err)res.send(err)
        else res.send(Utils.UniversalFunctions.sendSuccess(Utils.AppConstants.STATUS_MSG.SUCCESS.DEFAULT, data))
    })
})

router.get('/initials', function (req, res) {
    UserController.initials(req.query,function(err, data) {
        if(err)res.send(err)
        else res.send(Utils.UniversalFunctions.sendSuccess(Utils.AppConstants.STATUS_MSG.SUCCESS.DEFAULT, data))
    })
})

router.post('/primaryInitial', function (req, res) {
    UserController.primaryInitial(req.body,function(err, data) {
        if(err)res.send(err)
        else res.send(Utils.UniversalFunctions.sendSuccess(Utils.AppConstants.STATUS_MSG.SUCCESS.DEFAULT, data))
    })
})

router.post('/user/forgotPassword', function (req, res) {
    var schema = joi.object().keys({
        email: joi.string().email().required(),
    });
    var result = joi.validate({email:req.body.email}, schema);
    if(result.error == null){
        console.log('req.body',req.body);
        UserController.forgotPassword(req.body,function(err, data) {
            if(err)res.send(err)
            else res.send(Utils.UniversalFunctions.sendSuccess(Utils.AppConstants.STATUS_MSG.SUCCESS.DEFAULT, data))
        })
    }else { res.send(result.error)}
})

router.post('/general/api', function (req, res) {
    UserController.forgotPassword(req.body,function(err, data) {
        if(err)res.send(err)
        else res.send(Utils.UniversalFunctions.sendSuccess(Utils.AppConstants.STATUS_MSG.SUCCESS.DEFAULT, data))
    })
})

router.post('/user/email/verification', function (req, res) {
    var schema = joi.object().keys({
        email: joi.string().email().required(),
    });
    var result = joi.validate({email:req.body.email}, schema);
    if(result.error == null){
        UserController.isEmailVerified(req.body,function(err, data) {
            if(err)res.send(err)
            else res.send(Utils.UniversalFunctions.sendSuccess(Utils.AppConstants.STATUS_MSG.SUCCESS.DEFAULT, data))
        })
    }else { res.send(result.error)}
})

router.get('/verifyEmail',function(req,res){
    let token = req.query.token;
    if(token){
        UserController.verifyToken(req.query,function(err, data) {
            if(err || data.success == 0) res.render('./webApp/link-expired');
            else //res.send(Utils.UniversalFunctions.sendSuccess(Utils.AppConstants.STATUS_MSG.SUCCESS.DEFAULT, data))
                res.render('./webApp/email-confirmed');
        })
    }else { res.send(result.error)}
})

router.get('/setPassword',function(req,res){

    let token = req.query.token || null;
    let old_password = req.query.old_password || null;
    if(token){
        UserController.setPassword(req.query,function(err, data) {
            if(err || data.success == 0) res.render('./webApp/link-expired');
            else //res.send(Utils.UniversalFunctions.sendSuccess(Utils.AppConstants.STATUS_MSG.SUCCESS.DEFAULT, data))
                res.render('./webApp/reset-password',{reset_password_token:token});
        })
    }else{ res.send(result.error)}
})

router.post('/changePassword',function(req,res){
    UserController.changePassword(req.body,function(err, data) {
        if(err)res.send(err)
        else //res.send(Utils.UniversalFunctions.sendSuccess(Utils.AppConstants.STATUS_MSG.SUCCESS.DEFAULT, data))
            res.render('./webApp/login');
    })
})

router.post('/user/data', function (req, res) {
    
    UserController.userData(req.body,function(err, data) {
        if(err)res.send(err)
        else res.send(Utils.UniversalFunctions.sendSuccess(Utils.AppConstants.STATUS_MSG.SUCCESS.DEFAULT, data))
    })
})

router.post('/resend/email', function (req,res){
    UserController.resendEmail(req.body,function(err, data) {
        if(err)res.send(err)
        else res.send(Utils.UniversalFunctions.sendSuccess(Utils.AppConstants.STATUS_MSG.SUCCESS.DEFAULT, data))
    })
})

router.post('/user/information', function (req, res) {
    UserController.userInfo(req.body,function(err, data) {
        if(err)res.send(err)
        else res.send(Utils.UniversalFunctions.sendSuccess(Utils.AppConstants.STATUS_MSG.SUCCESS.DEFAULT, data))
    })
})

router.post('/appVersion', function(req,res) {
    AppController.appVersion(req.body,function(err, data) {
        if(err)res.send(err)
        else res.send(Utils.UniversalFunctions.sendSuccess(Utils.AppConstants.STATUS_MSG.SUCCESS.DEFAULT, data))
    })
})

router.post('/documents', function (req, res) {
    UserController.userDocument(req.body,req.files,function(err, data) {
        if(err)res.send(err)
        else res.send(Utils.UniversalFunctions.sendSuccess(Utils.AppConstants.STATUS_MSG.SUCCESS.DEFAULT, data))
    })
})

router.get('/userNeedSignature', function (req, res) {
    UserController.getDocument(req.query,function(err, data){
        console.log("userNeedSignature==",data);
        if(err)res.send(err)
        else res.send(Utils.UniversalFunctions.sendSuccess(Utils.AppConstants.STATUS_MSG.SUCCESS.DEFAULT, data))
    })
})

router.get('/documentCompleted', function (req, res) {
    UserController.documentStatus(req.query,function(err, data) {
        if(err)res.send(err)
        else res.send(Utils.UniversalFunctions.sendSuccess(Utils.AppConstants.STATUS_MSG.SUCCESS.DEFAULT, data))
    })
})

router.get('/pendingDocumentSign', function (req, res) {
    UserController.pendingDocumentSign(req.query,function(err, data) {
        if(err)res.send(err)
        else res.send(Utils.UniversalFunctions.sendSuccess(Utils.AppConstants.STATUS_MSG.SUCCESS.DEFAULT, data))
    })
})

router.post('/updateDocument', function (req, res) {
    UserController.updateDocument(req.body,req.files,function(err, data) {
        if(err)res.send(err)
        else res.send(Utils.UniversalFunctions.sendSuccess(Utils.AppConstants.STATUS_MSG.SUCCESS.DEFAULT, data))
    })
})

router.post('/users', function (req, res) {
    UserController.findUser(req.body,function(err, data) {
        if(err)res.send(err)
        else res.send(Utils.UniversalFunctions.sendSuccess(Utils.AppConstants.STATUS_MSG.SUCCESS.DEFAULT, data))
    })
})


router.post('/general', function (req, res) {
    UserController.adminInfo(req.body,function(err, data) {
        if(err)res.send(err)
        else res.send(Utils.UniversalFunctions.sendSuccess(Utils.AppConstants.STATUS_MSG.SUCCESS.DEFAULT, data))
    })
})

router.get('/documentInformation/:document_id', function (req, res) {
    UserController.documentInformation(req.params,function(err, data) {
        if(err)res.send(err)
        else res.send(Utils.UniversalFunctions.sendSuccess(Utils.AppConstants.STATUS_MSG.SUCCESS.DEFAULT, data))
    })
})

router.post('/reminders', function (req, res) {
    
    UserController.userReminder(req.body,function(err, data) {
        if(err)res.send(err)
        else res.send(Utils.UniversalFunctions.sendSuccess(Utils.AppConstants.STATUS_MSG.SUCCESS.DEFAULT, data))
    })
})

router.get('/recentDocuments', function (req, res) {
    
    UserController.recentDocument(req.query,function(err, data) {
        if(err)res.send(err)
        else res.send(Utils.UniversalFunctions.sendSuccess(Utils.AppConstants.STATUS_MSG.SUCCESS.DEFAULT, data))
    })
})


router.post('/hideDocument', function (req, res) {
    
    UserController.hideDocument(req.body,function(err, data) {
        if(err)res.send(err)
        else res.send(Utils.UniversalFunctions.sendSuccess(Utils.AppConstants.STATUS_MSG.SUCCESS.DEFAULT, data))
    })
})

router.post('/favouriteDocument', function (req, res) {
    
    UserController.favouriteDocument(req.body,function(err, data) {
        if(err)res.send(err)
        else res.send(Utils.UniversalFunctions.sendSuccess(Utils.AppConstants.STATUS_MSG.SUCCESS.DEFAULT, data))
    })
})

router.get('/importantDocuments', function (req, res) {
    
    UserController.importantDocuments(req.query,function(err, data) {
        if(err)res.send(err)
        else res.send(Utils.UniversalFunctions.sendSuccess(Utils.AppConstants.STATUS_MSG.SUCCESS.DEFAULT, data))
    })
})

router.put('/editFileName', function (req, res)
{
    UserController.renameFileName(req.body,function(err, data) {
        if(err)res.send(err)
        else res.send(Utils.UniversalFunctions.sendSuccess(Utils.AppConstants.STATUS_MSG.SUCCESS.DEFAULT, data))
    })
})

router.post('/sendPushNotifiation', function (req, res)
{
    UserController.PushNotifiation(req.body,function(err, data) {
        if(err)res.send(err)
        else res.send(Utils.UniversalFunctions.sendSuccess(Utils.AppConstants.STATUS_MSG.SUCCESS.DEFAULT, data))
    })
})

module.exports = router;