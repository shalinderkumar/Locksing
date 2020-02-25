var async       = require('async');
var UserService = require('../services/UserService');
var Utils       = require('../utils');
var fs          = require('fs');
const AWS       = require('aws-sdk');
const path      = require('path');
var nodemailer  = require('nodemailer');
var MD5         = require('md5');
var _ = require('underscore');
var request = require('request');

//var mv = require('mv');
// const env    = require('../config/env')();
// const FCMKey = env.FCM;
var FCM      = require('fcm-node');
var fcmKey = 'AAAA1VT7ryc:APA91bEfnvtH_E98K-LVofG7CslUtx7yHYqUCynf31k-HFUbC1kX-OKgvxiCVQsniINp5g-IIapRD8Es0my04sd9DuK0eCq-iGmVESbaCX_CIuK1mIbZu6b4eK-ExGfRiIeKzxl4Hh__';
// var fcm = new FCM(FCMKey);
// var fcmKey = 'AIzaSyDsL_xl-yL-mVa9RonAlsiCjxbsuIT8DFE';
var user_image_url      = "https://locksign-dev.s3.amazonaws.com/User/";
const clientEmail       = "test@applify.co";
const clientEmailPass   = "test@1234";

var transporter = nodemailer.createTransport({
    //host:'mail.flaksam.com',
    host:'smtp.gmail.com',
    service: 'gmail',
    port: 465,
    secure: true,
    auth: {
        user: clientEmail,
        pass: clientEmailPass
    },
    tls: {
        rejectUnauthorized: false
    }
});

var sendMail = function(toAddress,bccAddress,subject, content, next) {
    var mailOptions = {
        from: "LOCKSIGN <" + clientEmail + ">",
        to: toAddress,
        bcc: bccAddress,
        replyTo: clientEmail,
        subject: subject,
        html: content
    };
    transporter.sendMail(mailOptions)
};

var userImage = "https://locksign-dev.s3.amazonaws.com/User/"
var signUp = function(payloadData, callback){

    var userId = Utils.UniversalFunctions.generateRandomString(16);
    async.auto({
        findUser: function(cb) {
            let condition={email:payloadData.email}
            UserService.getUserInfo(condition,function(err,result){
                if(err){
                    console.log(err)
                    cb(Utils.AppConstants.STATUS_MSG.ERROR.IMP_ERROR)
                }
                else{
                    console.log('results.findUser==',result);
                    cb(null,result)
                }
            })
        },
        setToken: ['findUser',function(results,cb) {

            //console.log('results.findUser==',results.findUser);
            if(results.findUser == null) {
                let dataToToken={id:userId,type:"appUser",}
                Utils.Token.setToken(dataToToken,function(err,tokenData){
                    if(err){
                        cb(Utils.AppConstants.STATUS_MSG.ERROR.IMP_ERROR)
                    }else{
                        cb(null,tokenData)
                    }
                })
            }else{
                if(results.findUser.email_status == 1) {
                    callback(Utils.AppConstants.STATUS_MSG.ERROR.USER_ALREADY_EXIST)
                }else{

                    let password  =  Utils.UniversalFunctions.CryptData(payloadData.password);
                    let token = Utils.UniversalFunctions.generateRandomString(20);
                    let user_password = {'password':password,'email_verification_token':token};
                    UserService.updatePassword(user_password,payloadData.email,function(err,result){
                        if(err){                         
                            cb(Utils.AppConstants.STATUS_MSG.ERROR.IMP_ERROR)
                        }
                        else{
                            let email_verification_url = baseUrl+'verifyEmail?token='+token;
                        // console.log('email_verification_url',email_verification_url)
                        var email_html = `<!DOCTYPE html>
                        <html>
                          <head><title>Verify Email</title><meta charset="utf-8"></head>
                          <body style="margin:0px; padding:0px;">
                            <div style="background: #F8F9FD;padding:50px 10px;">
                              <table style="width:600px;font-family:Helvetica, sans-serif; margin: 0 auto;border-collapse: collapse;letter-spacing:0.7px;">
                                <tr>
                                  <td style="padding:0;">
                                    <table style="width:100%;border-collapse: collapse;" align="center">
                                      <tr>
                                        <td align="center" style="vertical-align:middle; padding:20px 50px;text-align:center;">
                                          <img src=https://locksign-dev.s3.amazonaws.com/project_images/new_logo.png>
                                        </td>
                                      </tr>
                                    </table>
                                  </td>
                                </tr>
                                <tr>
                                  <td>&nbsp;</td>
                                </tr> 
                                <tr>
                                  <td style="padding:0">
                                    <table style="width:100%;border-collapse: collapse;background:#fff;border:1px solid #E7E8F3;">
                                      <tr>
                                        <td>&nbsp;</td></tr><tr><td>&nbsp;</td>
                                      </tr>
                                      <tr>
                                        <td>&nbsp;</td>
                                      </tr>
                                      <tr>
                                        <td>&nbsp;</td>
                                      </tr>
                                      <tr>
                                        <td>
                                          <p style="margin-top:0;padding:0px 50px;color:#013f6a;text-align:center">
                                            <strong style="padding: 5px 0px;font-size:1.3em;">Verify Email</strong>
                                          </p>
                                        </td>
                                      </tr>
                                      <tr>
                                        <td>&nbsp;</td>
                                      </tr>
                                      <tr>
                                        <td>
                                          <p style="margin-top:0;padding:0px 50px;color:#494949;color:#494949;">
                                            <strong style="background:#fff;padding: 5px 0px;font-size:1.1em;">Dear User</strong>
                                          </p>
                                          <p>&nbsp;</p>
                                        </td>
                                      </tr>
                                      <tr>
                                        <td style="vertical-align:top;padding:5px 50px;">
                                          <p style="font-size:16px; color:#494949;margin:0;">HELLO
                                        WELCOME TO LOCKSIGN</p>
                                            <p>&nbsp;</p>
                                        </td>
                                      </tr>
                                      <tr>
                                        <td style="vertical-align:top;padding:0px 50px">
                                          <p style="font-size:16px; color:#494949;line-height:24px;">Thanks for creating your account with LockSign. Please verify your email by clicking on the link below.</p>
                                        </td>
                                      </tr>
                                      <tr>
                                        <td style="vertical-align:top;padding:10px 50px"> 
                                          <a href="`+email_verification_url+`" style="display:inline-block;padding:10px 15px;background:#013f6a;color:#fff;text-decoration:none;border-radius:4px;">Verify Email</a>
                                        </td>
                                      </tr>
                                      <tr>
                                        <td>&nbsp;</td>
                                      </tr>
                                      <tr>
                                        <td style="font-size:16px;color:#494949;line-height:24px;padding:0 50px;"><strong>Best Regards,</strong><br> LockSign Support Team</td>
                                      </tr>
                                      <tr>
                                        <td>&nbsp;</td>
                                      </tr>
                                      <tr>
                                        <td>&nbsp;</td>
                                      </tr>
                                      <tr>
                                        <td>&nbsp;</td>
                                      </tr>
                                      <tr>
                                        <td>&nbsp;</td>
                                      </tr>
                                    </table>
                                  </td>
                                </tr>
                                <tr>
                                  <td style="padding:0;">
                                    <table style="width:100%; color:#000; font-size:.9em; text-align:center;border-collapse: collapse;padding:20px 0">
                                      <tr>
                                        <td>&nbsp;</td>
                                      </tr>
                                      <tr>
                                        <td>&nbsp;</td>
                                      </tr>
                                      <tr>
                                        <td style="padding:5px 20px;"><span style="display:inline-block; padding:0 6px;">Copyright &copy; 2019 LockSign</span>
                                        </td>
                                      </tr>
                                      <tr>
                                        <td style="padding:5px 20px;">
                                          <a href="#" style="display:inline-block; color:#000; padding:0 6px;">Privacy Policy</a>
                                          <a href="#" style="display:inline-block; color:#000; padding:0 6px;">Terms &amp; Conditions</a>
                                        </td>
                                      </tr>
                                      <tr>
                                        <td>&nbsp;</td>
                                      </tr>
                                    </table>
                                  </td>
                                </tr>
                              </table>
                            </div>
                          </body>
                        </html>`;
                        sendMail(payloadData.email,bccAddress=null,'Verify Email', email_html, function (err, res) {
                            if(err){
                                console.log('ERROR!:',err);
                            }
                            console.log('email results',res)
                        });
                            cb(null,results.findUser)
                        }
                    })
                }
              
                // cb(null,results.findUser);
                // callback(Utils.AppConstants.STATUS_MSG.ERROR.USER_ALREADY_EXIST)
            }
        }],
        userSignUp: ['setToken','findUser',function(results,cb) { 
            if(results.findUser == null){
            // console.log('oneeeeeeeeee',results.findUser)
                // var token = 'dad#ad%^ad%^$&6655as65dsasad57sdfs35454';
                let token = Utils.UniversalFunctions.generateRandomString(20);
                let secret_key = Utils.UniversalFunctions.generateRandomString(16);
                //console.log('tokennnnnnnnnnnn',token)
                var dataToSignin={
                    'access_token':results.setToken,
                    'user_id': userId,
                    'name': null,
                    'image': null,
                    'phone_number': null,
                    'email':payloadData.email,
                    'password': Utils.UniversalFunctions.CryptData(payloadData.password),
                    'email_verification_token':token,
                    'secret_key':secret_key
                }
                UserService.createUser(dataToSignin,function(err,result){
                    if(err){  
                        console.log(err)                          
                        cb(Utils.AppConstants.STATUS_MSG.ERROR.IMP_ERROR)
                    }else{
                        let email_verification_url = baseUrl+'verifyEmail?token='+token;
                        // console.log('email_verification_url',email_verification_url)
                        let user_name = result.name;
                        var email_html = `<!DOCTYPE html>
                        <html>
                          <head><title>Verify Email</title><meta charset="utf-8"></head>
                          <body style="margin:0px; padding:0px;">
                            <div style="background: #F8F9FD;padding:50px 10px;">
                              <table style="width:600px;font-family:Helvetica, sans-serif; margin: 0 auto;border-collapse: collapse;letter-spacing:0.7px;">
                                <tr>
                                  <td style="padding:0;">
                                    <table style="width:100%;border-collapse: collapse;" align="center">
                                      <tr>
                                        <td align="center" style="vertical-align:middle; padding:20px 50px;text-align:center;">
                                          <img src=https://locksign-dev.s3.amazonaws.com/project_images/new_logo.png>
                                        </td>
                                      </tr>
                                    </table>
                                  </td>
                                </tr>
                                <tr>
                                  <td>&nbsp;</td>
                                </tr>
                                <tr>
                                  <td style="padding:0">
                                    <table style="width:100%;border-collapse: collapse;background:#fff;border:1px solid #E7E8F3;">
                                      <tr>
                                        <td>&nbsp;</td></tr><tr><td>&nbsp;</td>
                                      </tr>
                                      <tr>
                                        <td>&nbsp;</td>
                                      </tr>
                                      <tr>
                                        <td>&nbsp;</td>
                                      </tr>
                                      <tr>
                                        <td>
                                          <p style="margin-top:0;padding:0px 50px;color:#013f6a;text-align:center">
                                            <strong style="padding: 5px 0px;font-size:1.3em;">Verify Email</strong>
                                          </p>
                                        </td>
                                      </tr>
                                      <tr>
                                        <td>&nbsp;</td>
                                      </tr>
                                      <tr>
                                        <td>
                                          <p style="margin-top:0;padding:0px 50px;color:#494949;color:#494949;">
                                            <strong style="background:#fff;padding: 5px 0px;font-size:1.1em;">Dear User</strong>
                                          </p>
                                          <p>&nbsp;</p>
                                        </td>
                                      </tr>
                                      <tr>
                                        <td style="vertical-align:top;padding:5px 50px;">
                                          <p style="font-size:16px; color:#494949;margin:0;">HELLO
                                        WELCOME TO LOCKSIGN</p>
                                            <p>&nbsp;</p>
                                        </td>
                                      </tr>
                                      <tr>
                                        <td style="vertical-align:top;padding:0px 50px">
                                          <p style="font-size:16px; color:#494949;line-height:24px;">Thanks for creating your account with LockSign. Please verify your email by clicking on the link below.</p>
                                        </td>
                                      </tr>
                                      <tr>
                                        <td style="vertical-align:top;padding:10px 50px"> 
                                          <a href="`+email_verification_url+`" style="display:inline-block;padding:10px 15px;background:#013f6a;color:#fff;text-decoration:none;border-radius:4px;">Verify Email</a>
                                        </td>
                                      </tr>
                                      <tr>
                                        <td>&nbsp;</td>
                                      </tr>
                                      <tr>
                                        <td style="font-size:16px;color:#494949;line-height:24px;padding:0 50px;"><strong>Best Regards,</strong><br> LockSign Support Team</td>
                                      </tr>
                                      <tr>
                                        <td>&nbsp;</td>
                                      </tr>
                                      <tr>
                                        <td>&nbsp;</td>
                                      </tr>
                                      <tr>
                                        <td>&nbsp;</td>
                                      </tr>
                                      <tr>
                                        <td>&nbsp;</td>
                                      </tr>
                                    </table>
                                  </td>
                                </tr>
                                <tr>
                                  <td style="padding:0;">
                                    <table style="width:100%; color:#000; font-size:.9em; text-align:center;border-collapse: collapse;padding:20px 0">
                                      <tr>
                                        <td>&nbsp;</td>
                                      </tr>
                                      <tr>
                                        <td>&nbsp;</td>
                                      </tr>
                                      <tr>
                                        <td style="padding:5px 20px;"><span style="display:inline-block; padding:0 6px;">Copyright &copy; 2019 LockSign</span>
                                        </td>
                                      </tr>
                                      <tr>
                                        <td style="padding:5px 20px;">
                                          <a href="#" style="display:inline-block; color:#000; padding:0 6px;">Privacy Policy</a>
                                          <a href="#" style="display:inline-block; color:#000; padding:0 6px;">Terms &amp; Conditions</a>
                                        </td>
                                      </tr>
                                      <tr>
                                        <td>&nbsp;</td>
                                      </tr>
                                    </table>
                                  </td>
                                </tr>
                              </table>
                            </div>
                          </body>
                        </html>`;
                        let bccAddress = '';
                        sendMail(payloadData.email,bccAddress,'Verify Email', email_html, function (err, res) {
                            if(err){
                                console.log('ERROR!:',err);
                            }
                            console.log('email results',res)
                        });
                        cb(null,result)
                    }
                })
            }else{
               cb(null,results.findUser);
               //callback(Utils.AppConstants.STATUS_MSG.ERROR.USER_ALREADY_EXIST)
            }
        }],
        signUp: ['userSignUp',function(results,cb) {

            // console.log("results==tttttttttttttesttttttt",results); 
            if(results.userSignUp == null){
               callback(Utils.AppConstants.STATUS_MSG.ERROR.USER_NOT_FOUND)
            }else{
                var user_data = results.userSignUp;
                var dataToSignin={
                    'user_id': results.userSignUp.id || null,
                    'device_token': payloadData.deviceToken || null,
                    'device_type': payloadData.deviceType || null
                }
                UserService.createUserSession(dataToSignin,function(err,result){
                    if(err){  
                    console.log(err)                          
                        cb(Utils.AppConstants.STATUS_MSG.ERROR.IMP_ERROR)
                    }
                    else{
                        user_data.device_token = result.device_token;
                        user_data.device_type = result.device_type;
                        // console.log("user_data======",user_data);
                        user_data.app_key = appkey;
                        cb(null,user_data)
                    }
                })
               // callback(Utils.AppConstants.STATUS_MSG.ERROR.USER_ALREADY_EXIST)
            }
        }],
    },
    function(err,result){
        if(err){
            callback(err)
        }
        else{
            callback(null,result.signUp)
        }
    })
};

var socialMediaSignUp = function(payloadData, callback){

    var userId = Utils.UniversalFunctions.generateRandomString(16);
    async.auto({
        findUser: function(cb) {
            let condition={email:payloadData.email}
            UserService.getUserInfo(condition,function(err,result){
                if(err){
                    console.log(err)
                    cb(Utils.AppConstants.STATUS_MSG.ERROR.IMP_ERROR)
                }
                else{
                    cb(null,result)
                }
            })
        },
        setToken: ['findUser',function(results,cb) {
            if(results.findUser == null) {
                let dataToToken={id:userId,type:"appUser",}
                Utils.Token.setToken(dataToToken,function(err,tokenData){
                    if(err){
                        cb(Utils.AppConstants.STATUS_MSG.ERROR.IMP_ERROR)
                    }else{
                        cb(null,tokenData)
                    }
                })
            }else{
                callback(null,results)
            }
        }],
        userSignUp: ['setToken','findUser',function(results,cb) { 
            console.log(payloadData)
            var set_password = Utils.UniversalFunctions.generateRandomString(16);
            let password = Utils.UniversalFunctions.CryptData(set_password);
            let secret_key = Utils.UniversalFunctions.generateRandomString(16);
            if(results.findUser == null){

                if(payloadData.social_type == "0"){
                    var dataToSignin={
                        'access_token':results.setToken,
                        'secret_key':secret_key,
                        'user_id': userId,
                        'name': null,
                        'image': null,
                        'phone_number': null,
                        'email':payloadData.email,
                        'password': password,
                        'ln_id':payloadData.social_id,
                        'email_status':1
                    }
                }else if(payloadData.social_type == "1"){
                    var dataToSignin={
                        'access_token':results.setToken,
                        'secret_key':secret_key,
                        'user_id': userId,
                        'name': null,
                        'image': null,
                        'phone_number': null,
                        'email':payloadData.email,
                        'password': password,
                        'g_id':payloadData.social_id,
                        'email_status':1
                    }
                }else if(payloadData.social_type == "2"){
                    var dataToSignin={
                        'access_token':results.setToken,
                        'secret_key':secret_key,
                        'user_id': userId,
                        'name': null,
                        'image': null,
                        'phone_number': null,
                        'email':payloadData.email,
                        'password': password,
                        'fb_id':payloadData.social_id,
                        'email_status':1
                    }
                }
                UserService.createUser(dataToSignin,function(err,result){
                    if(err){  
                    console.log(err)                          
                        cb(Utils.AppConstants.STATUS_MSG.ERROR.IMP_ERROR)
                    }
                    else{
                        cb(null,result)
                    }
                })
            }else{
               callback(Utils.AppConstants.STATUS_MSG.ERROR.USER_ALREADY_EXIST)
            }
        }],
        signUp: ['userSignUp',function(results,cb) {
            if(results.userSignUp == null){
               callback(Utils.AppConstants.STATUS_MSG.ERROR.USER_NOT_FOUND)
            }else{

                var user_data = results.userSignUp;
                var dataToSignin={
                    'user_id': results.userSignUp.id || null,
                    'device_token': payloadData.deviceToken || null,
                    'device_type': payloadData.deviceType || null
                }
                UserService.createUserSession(dataToSignin,function(err,result){
                    if(err){  
                    console.log(err)                          
                        cb(Utils.AppConstants.STATUS_MSG.ERROR.IMP_ERROR)
                    }
                    else{
                        user_data.device_token = result.device_token;
                        user_data.device_type  = result.device_type;
                        user_data.app_key      = appkey;
                        cb(null,user_data)
                        // console.log("results============12311321",user_data); 
                    }
                })
               // callback(Utils.AppConstants.STATUS_MSG.ERROR.USER_ALREADY_EXIST)
            }
        }],
    },
    function(err,result){
        if(err){
            callback(err)
        }
        else{
            callback(null,result.signUp)
        }
    })
};

var login = function(payloadData, callback){


    /*let condition={access_token:payloadData.access_token}
    UserService.getUserInfo(condition,function(err,result){
        if(err){
            console.log(err)
            callback(Utils.AppConstants.STATUS_MSG.ERROR.IMP_ERROR)
        }
        else{
            if(result == null){
                callback(Utils.AppConstants.STATUS_MSG.ERROR.USER_NOT_FOUND)
            }else{
                callback(null,result)
            }
        }
    })*/

    let condition={email:payloadData.email}
    UserService.getUserInfo(condition,function(err,result){
        if(err){
            console.log(err)
            callback(Utils.AppConstants.STATUS_MSG.ERROR.IMP_ERROR)
        }
        else{
            if(result == null){
                callback(Utils.AppConstants.STATUS_MSG.ERROR.USER_NOT_FOUND)
            }else{
                var password = Utils.UniversalFunctions.CryptData(payloadData.password);
                if(password == result.password){
                    if(result.dataValues.image == null){
                        result.dataValues.image = null;
                    }else{
                        result.dataValues.image = s3Url+'User/'+result.dataValues.image;
                    }
                    result.dataValues.app_key = appkey;
                    //console.log('loginnn====',result);
                    callback(null,result)
                }else{
                    callback(Utils.AppConstants.STATUS_MSG.ERROR.INCORRECT_PASSWORD)
                }
            }
        }
    })
};

var socialLogin = function(payloadData, callback){

    /*if(payloadData.social_type == 'Linkdin'){
        var condition={email:payloadData.email,ln_id:payloadData.social_id}
    }else if(payloadData.social_type == 'Facebook'){
        var condition={email:payloadData.email,fb_id:payloadData.social_id}
    }else{
        var condition={email:payloadData.email,g_id:payloadData.social_id}
    }

    UserService.getUser(condition,function(err,result){
        console.log("result======",result);
        if(err){
            console.log(err)
            callback(Utils.AppConstants.STATUS_MSG.ERROR.IMP_ERROR)
        }
        else{
            if(result == null){
                callback(Utils.AppConstants.STATUS_MSG.ERROR.USER_NOT_FOUND)
            }else{
                callback(null,result)
            }
        }
    })*/

    async.auto({
        findUser: function(cb) {
            if(payloadData.social_type == "0"){
                var condition={email:payloadData.email,ln_id:payloadData.social_id}
            }else if(payloadData.social_type == "1"){
                var condition={email:payloadData.email,g_id:payloadData.social_id}
            }else if(payloadData.social_type == "2"){
                var condition={email:payloadData.email,fb_id:payloadData.social_id}
            } 
            // let condition={email:payloadData.email}
            UserService.getUserInfo(condition,function(err,result){
                if(err){
                    console.log(err)
                    cb(Utils.AppConstants.STATUS_MSG.ERROR.IMP_ERROR)
                }
                else{
                    if (result!=null) {
                        if(result.dataValues.image == null){
                            result.dataValues.image = null;
                        }else{
                            result.dataValues.image = s3Url+'User/'+result.dataValues.image;
                        }
                        result.dataValues.app_key = appkey;
                    }
                   
                    cb(null,result)
                }
            })
        },
        signUp: ['findUser',function(results,cb) {

            if(results.findUser == null){
               callback(Utils.AppConstants.STATUS_MSG.ERROR.USER_NOT_FOUND)
            }else{
                var user_data = results.findUser;
                var dataToSignin={
                    'user_id': results.findUser.id || null,
                    'device_token': payloadData.deviceToken || null,
                    'device_type': payloadData.deviceType || null
                }
                UserService.createUserSession(dataToSignin,function(err,result){
                    if(err){  
                    console.log(err)                          
                        cb(Utils.AppConstants.STATUS_MSG.ERROR.IMP_ERROR)
                    }
                    else{
                        user_data.device_token = result.device_token;
                        user_data.device_type  = result.device_type;
                        cb(null,user_data)
                        // console.log("results==tttttttttttttesttttttt",results); 
                    }
                })
               // callback(Utils.AppConstants.STATUS_MSG.ERROR.USER_ALREADY_EXIST)
            }
        }],
    },
    function(err,result){
        if(err){
            callback(err)
        }
        else{
            callback(null,result.signUp)
        }
    })
};

var isEmailVerified = function(payloadData, callback){
    
    let condition={email:payloadData.email}
    UserService.getUser(condition,function(err,result){
        if(err){
            console.log(err)
            callback(Utils.AppConstants.STATUS_MSG.ERROR.IMP_ERROR)
        }
        else{
            // console.log("result==",result.emailStatus);
            result.emailStatus = {"emailStatus":result.emailStatus};
            callback(null,result)
        }
    })
};

var userProfile = function(payloadData,file,callback){

    //configuring the AWS environment
    if(file.image != undefined){
     console.log('file exists',file.image);
        AWS.config.update({
            accessKeyId: "AKIAZUR4TXH5KRTIQZLX",
            secretAccessKey: "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"
        });

        var s3 = new AWS.S3();
        var filePath = file.image.path;

        //configuring parameters
        var image_name = '';
        image_name = Date.now()+"_"+path.basename(filePath);

        var params = {
            Bucket: 'locksign-dev',
            Body : fs.createReadStream(filePath),
            Key : "User/"+image_name,
            ACL : 'public-read'
        };
        var profile_data={
            'name': payloadData.name || null,
            'image': image_name || null,
            'phone_number': payloadData.phone_number || null,
            'country_code':payloadData.country_code || null,
        }
        //handle error
        s3.upload(params, function (err, data) {
            if (err) {
               console.log("Error", err);
            }
            //success
            if(data){
                UserService.updateUserProfile(profile_data,payloadData.access_token,function(err,result){
                    if(err){
                        console.log(err)
                        callback(Utils.AppConstants.STATUS_MSG.ERROR.IMP_ERROR)
                    }
                    else{
                        // console.log("Uploaded result :", result);
                        //result.dataValues.image = s3Url+'User/'+result.dataValues.image;
                        if (result!=null) {
                            if(result.dataValues.image == null){
                                result.dataValues.image = null;
                            }else{
                                result.dataValues.image = s3Url+'User/'+result.dataValues.image;
                            }
                        }

                        UserService.getSignature(result.dataValues.id,function(err,results){
                            if(err){
                                console.log(err)
                                callback(Utils.AppConstants.STATUS_MSG.ERROR.IMP_ERROR)
                            }
                            else{
                                console.log("Uploaded result :", result);
                                result.dataValues.signature = results;
                                callback(null,result)
                            }
                        })
                        // callback(null,result)
                    }
                })
            }
        });
    }else{

        var profile_data={
            'name': payloadData.name || null,
            'first_name':payloadData.first_name || null,
            'middle_name': payloadData.middle_name || null,
            'last_name':payloadData.last_name || null,
            'email':payloadData.email || null,
            'phone_number':payloadData.phone_number || null,
            'contact_number':payloadData.contact_number || null,
            'dob':payloadData.dob || null,
            'house_number':payloadData.house_number || null,
            'locality':payloadData.locality || null,
            'pincode':payloadData.pincode || null,
            'city':payloadData.city || null,
            'state':payloadData.state || null,
            'country':payloadData.country || null
        }

        UserService.updateUserProfile(profile_data,payloadData.access_token,function(err,result){
            if(err){
                // console.log(err)
                callback(Utils.AppConstants.STATUS_MSG.ERROR.IMP_ERROR)
            }
            else{
                // console.log("Uploaded result :", result);
                //result.dataValues.image = s3Url+'User/'+result.dataValues.image;
                if (result!=null) {
                    if(result.dataValues.image == null){
                        result.dataValues.image = null;
                    }else{
                        result.dataValues.image = s3Url+'User/'+result.dataValues.image;
                    }
                }

                UserService.getSignature(result.dataValues.id,function(err,results){
                    if(err){
                        console.log(err)
                        callback(Utils.AppConstants.STATUS_MSG.ERROR.IMP_ERROR)
                    }
                    else{
                        console.log("Uploaded result :", result);
                        result.dataValues.signature = results;
                        callback(null,result)
                    }
                })
            }
        })
    }
};

var forgotPassword = function(payloadData,callback){

    let condition={email:payloadData.email}
    UserService.getUser(condition,function(err,result){
        if(err){
            console.log(err)
            callback(Utils.AppConstants.STATUS_MSG.ERROR.IMP_ERROR)
        }
        else{
            if(result != null){

            if(result.dataValues.email_status == 1){
                let token = Utils.UniversalFunctions.generateRandomString(20);
                //console.log('token===========',token);
                 // = 'sdadd212a21321a32a';
                let password_reset_token = {'password_reset_token':token}
                UserService.resendEmail(password_reset_token,payloadData.email,function(err,result){
                    if (err) {
                        //console.log(err)
                        callback(Utils.AppConstants.STATUS_MSG.ERROR.IMP_ERROR)
                    }else{
                        let user_name        = result.name;
                        let set_password_url = baseUrl+'setPassword?token='+token;
                        var email_html = `<!DOCTYPE html>
                                        <html>
                                        <head>
                                            <title>Forgot Password</title>
                                            <meta charset="utf-8">
                                        </head>

                                        <body style="margin:0px; padding:0px;">
                                            <div style="background: #F8F9FD;padding:50px 10px;">
                                                <table style="width:600px;font-family:Helvetica, sans-serif; margin: 0 auto;border-collapse: collapse;letter-spacing:0.7px;">
                                                    <tr>
                                                        <td style="padding:0;">
                                                            <table style="width:100%;border-collapse: collapse;" align="center">
                                                                <tr>
                                                                    <td align="center" style="vertical-align:middle; padding:20px 50px;text-align:center;"><img src="https://locksign-dev.s3.amazonaws.com/project_images/new_logo.png"></td>
                                                                </tr>
                                                            </table>
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <td>&nbsp;</td>
                                                    </tr>
                                                    <tr>
                                                        <td style="padding:0">
                                                            <table style="width:100%;border-collapse: collapse;background:#fff;border:1px solid #E7E8F3;">
                                                                <tr>
                                                                    <td>&nbsp;</td>
                                                                </tr>
                                                                <tr>
                                                                    <td>&nbsp;</td>
                                                                </tr>
                                                                <tr>
                                                                    <td>&nbsp;</td>
                                                                </tr>
                                                                <tr>
                                                                    <td>&nbsp;</td>
                                                                </tr>
                                                                <tr>
                                                                    <td>
                                                                        <p style="margin-top:0;padding:0px 50px;color:#013f6a;text-align:center"><strong style="padding: 5px 0px;font-size:1.3em;">Forgot password</strong></p>
                                                                    </td>
                                                                </tr>
                                                                <tr>
                                                                    <td>&nbsp;</td>
                                                                </tr>
                                                                <tr>
                                                                    <td>
                                                                        <p style="margin-top:0;padding:0px 50px;color:#494949;"><strong style="background:#fff;padding: 5px 0px;font-size:1.1em;">Dear User</strong></p>
                                                                    </td>
                                                                </tr>

                                                                <tr>
                                                                    <td style="color:#434040; vertical-align:top;padding:0px 50px">
                                                                        <p style="font-size:16px; color:#494949;line-height:24px;">Hello,
    Forgot your password? Never fear, your reset is here - just click on the link below. </p>
                                                                    </td>
                                                                </tr>
                                                                <tr>
                                                                    <td style="color:#434040; vertical-align:top;padding:10px 50px">
                                                                        <a href="`+set_password_url+`" style="display:inline-block;padding:10px 15px;background:#013f6a;color:#fff;text-decoration:none;border-radius:4px;">Create new password</a>
                                                                    </td>
                                                                </tr>
                                                                <tr>
                                                                    <td>&nbsp;</td>
                                                                </tr>
                                                                <tr>
                                                                    <td style="font-size:16px; color:#494949;line-height:24px;padding:0 50px;"><strong>Best Regards,</strong><br> LockSign Support Team </td>
                                                                </tr>
                                                                <tr>
                                                                    <td>&nbsp;</td>
                                                                </tr>
                                                                <tr>
                                                                    <td>&nbsp;</td>
                                                                </tr>
                                                                <tr>
                                                                    <td>&nbsp;</td>
                                                                </tr>
                                                                <tr>
                                                                    <td>&nbsp;</td>
                                                                </tr>
                                                            </table>
                                                        </td>
                                                    </tr>
                                                    
                                                    <tr>
                                                        <td style="padding:0;">
                                                            <table style="width:100%; color:#000; font-size:.9em; text-align:center;border-collapse: collapse;padding:20px 0">
                                                                <tr>
                                                                    <td>&nbsp;</td>
                                                                </tr>
                                                                <tr>
                                                                    <td>&nbsp;</td>
                                                                </tr>
                                                                <tr>
                                                                    <td style="padding:5px 20px;"><span style="display:inline-block; padding:0 6px;">Copyright &copy; 2019 LockSign</span></td>
                                                                </tr>
                                                                <tr>
                                                                    <td style="padding:5px 20px;"><a href="#" style="display:inline-block; color:#000; padding:0 6px;">Privacy Policy</a> <a href="#" style="display:inline-block; color:#000; padding:0 6px;">Terms &amp; Conditions</a></td>
                                                                </tr>
                                                                <tr>
                                                                    <td>&nbsp;</td>
                                                                </tr>   
                                                            </table>
                                                        </td>
                                                    </tr>
                                                </table>
                                            </div>
                                        </body>
                                        </html>`;
                        let bccAddress = '';
                        sendMail(payloadData.email,bccAddress,'Reset Password Link', email_html, function (err, res) {
                            if(err){
                                console.log('ERROR!:',err);
                            }
                            console.log('email results',res)
                        });
                        callback(Utils.AppConstants.STATUS_MSG.SUCCESS.EMAIL_SUCCESS)
                    }
                })
            }else{
                callback(Utils.AppConstants.STATUS_MSG.ERROR.INVALID_EMAIL)
            }
            }else{
                callback(Utils.AppConstants.STATUS_MSG.ERROR.USER_NOT_FOUND)
            }
        }
    })  
}

var userSignature = function(payloadData,file,callback){

    async.auto({
        findUser: function(cb) {
            let condition={access_token:payloadData.access_token}
            UserService.getUser(condition,function(err,result){
                if(err){
                    console.log(err)
                    cb(Utils.AppConstants.STATUS_MSG.ERROR.IMP_ERROR)
                }
                else{
                    cb(null,result)
                }
            })
        },
        signature: ['findUser',function(results,cb) {

            if(results.findUser == null){
               callback(Utils.AppConstants.STATUS_MSG.ERROR.USER_NOT_FOUND)
            }else{
                // var user_data = results.findUser;
                if(file){
                    AWS.config.update({
                        accessKeyId: "AKIAZUR4TXH5KRTIQZLX",
                        secretAccessKey: "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"
                    });

                    var s3 = new AWS.S3();
                    var filePath = file.image.path;

                    //configuring parameters
                    var image_name = '';
                    image_name = Date.now()+"_"+path.basename(filePath);

                    var params = {
                        Bucket: 'locksign-dev',
                        Body : fs.createReadStream(filePath),
                        Key : "User/"+image_name,
                        ACL : 'public-read'
                    };

                    var signature_data={
                        'user_id': results.findUser.id || null,
                        'image': image_name || null,
                        'document_type':"1"
                    }
                    //handle error
                    s3.upload(params, function (err, data) {
                        if(err){
                           console.log("Error", err);
                        }
                        //success
                        if(data){
                            //console.log("Uploaded in:", data);
                            UserService.createSignature(signature_data,function(err,result){
                                console.log(result);
                                if(err){  
                                console.log(err)                          
                                    cb(Utils.AppConstants.STATUS_MSG.ERROR.IMP_ERROR)
                                }
                                else{
                                    cb(null,result)
                                    // console.log("results==ok",result.user_signatures); 
                                }
                            })
                        }
                    });
                }
                /*var signature_data={
                    'user_id': results.findUser.id || null,
                    'image': payloadData.image || null,
                }
                //'type': payloadData.type || null
                UserService.createSignature(signature_data,function(err,result){
                    console.log(result);
                    if(err){  
                    console.log(err)                          
                        cb(Utils.AppConstants.STATUS_MSG.ERROR.IMP_ERROR)
                    }
                    else{
                        cb(null,result)
                    }
                })*/
                // console.log("results==ok",result.user_signatures); 
                // callback(Utils.AppConstants.STATUS_MSG.ERROR.USER_ALREADY_EXIST)
            }
        }],
    },
    function(err,result){
        if(err){
            callback(err)
        }
        else{
            callback(null,result)
        }
    })
};

var verifyToken = function(payloadData,callback){

    // console.log("result================:==",condition);
    let condition={email_verification_token:payloadData.token}
    UserService.getUser(condition,function(err,result){
        if(err){
            // callback(Utils.AppConstants.STATUS_MSG.ERROR.IMP_ERROR)
            // callback(null,render('email-confirmed'));
            console.log(err)
            callback(null,{"success":0});
        }
        else{
            console.log(result)
            if(result == null){
                callback(null,{"success":0});
            }else{
                let update_email_status={email_status:1,email_verification_token:null}
                UserService.updateUserProfile(update_email_status,result.access_token,function(err,result){
                    if (err) {
                        console.log(err)
                        callback(Utils.AppConstants.STATUS_MSG.ERROR.IMP_ERROR)
                    }else{
                        console.log('result==',result);
                        // let user_name = result.name;
                        callback(null,{"success":1});
                    }
                })
            }
        }
    })  
}

var setPassword = function(payloadData,callback){

    // console.log("result================:==",condition);
    let condition={password_reset_token:payloadData.token}
    UserService.getUser(condition,function(err,result){
        if(err){
            // callback(Utils.AppConstants.STATUS_MSG.ERROR.IMP_ERROR)
            // callback(null,render('email-confirmed'));
            console.log(err)
            callback(null,{"success":0});
        }
        else{
            if(result == null){
                callback(null,{"success":0});
            }else{
                 callback(null,{"success":1});
            }
        }
    })  
}

var changePassword = function(payloadData,callback){

    let req={password_reset_token:payloadData.token}
    UserService.getUserdet(req,function(err,result){
        if(err){
            // console.log(err)
            callback(null,{"success":0});
            // callback(Utils.AppConstants.STATUS_MSG.ERROR.IMP_ERROR)
            // callback(null,render('email-confirmed'));
        }
        else{
            if (result == null) {
                callback(null,{"success":0});
            }else{
                let new_password =  Utils.UniversalFunctions.CryptData(payloadData.password);
                let password = {password:new_password,password_reset_token : null}
                // updatePassword()
                 UserService.changePassword(password,payloadData.token,function(err,result){
                    if (err) {
                        console.log(err)
                        callback(Utils.AppConstants.STATUS_MSG.ERROR.IMP_ERROR)
                    }else{
                        // let user_name = result.name;
                        callback(null,{"success":1});
                    }
                })
            }
            // res.render('email-confirmed');
        }
    })  
}

var userData = function(payloadData, callback){
    
    let condition={access_token:payloadData.access_token}
    UserService.getUserInfo(condition,function(err,result){
        if(err){
            console.log(err)
            callback(Utils.AppConstants.STATUS_MSG.ERROR.IMP_ERROR)
        }else{
            if(result == null){
                callback(Utils.AppConstants.STATUS_MSG.ERROR.USER_NOT_FOUND)
            }else{
                if (result!=null) {
                    if(result.dataValues.image == null){
                        result.dataValues.image = null;
                    }else{
                        result.dataValues.image = s3Url+'User/'+result.dataValues.image;
                    }
                }
                result.dataValues.app_key = appkey
                callback(null,result)
            }
        }
    })
};

var resendEmail = function(payloadData,callback){
    // console.log("result===",payloadData.email);
    let condition = {email:payloadData.email};
    UserService.getUser(condition,function(err,result){  
        if(err){
            console.log(err)
            callback(Utils.AppConstants.STATUS_MSG.ERROR.IMP_ERROR)
        }
        else{
            //let token = "sdf21s5fsdsd5fs5d5sd5fsfssfd5";
            let token     = Utils.UniversalFunctions.generateRandomString(20);
            let condition = {email_verification_token:token}
            UserService.resendEmail(condition,payloadData.email,function(err,results){
                if(err){
                    console.log(err)
                    callback(Utils.AppConstants.STATUS_MSG.ERROR.IMP_ERROR)
                }
                else{
                    if(results == null){
                        callback(Utils.AppConstants.STATUS_MSG.ERROR.USER_NOT_FOUND)
                    }else{
                        let email_verification_url = baseUrl+'verifyEmail?token='+token;
                        var email_html = `<!DOCTYPE html>
                                            <html>
                                              <head><title>Verify Email</title><meta charset="utf-8"></head>
                                              <body style="margin:0px; padding:0px;">
                                                <div style="background: #F8F9FD;padding:50px 10px;">
                                                  <table style="width:600px;font-family:Helvetica, sans-serif; margin: 0 auto;border-collapse: collapse;letter-spacing:0.7px;">
                                                    <tr>
                                                      <td style="padding:0;">
                                                        <table style="width:100%;border-collapse: collapse;" align="center">
                                                          <tr>
                                                            <td align="center" style="vertical-align:middle; padding:20px 50px;text-align:center;">
                                                              <img src=https://locksign-dev.s3.amazonaws.com/project_images/new_logo.png>
                                                            </td>
                                                          </tr>
                                                        </table>
                                                      </td>
                                                    </tr>
                                                    <tr>
                                                      <td>&nbsp;</td>
                                                    </tr>
                                                    <tr>
                                                      <td style="padding:0">
                                                        <table style="width:100%;border-collapse: collapse;background:#fff;border:1px solid #E7E8F3;">
                                                          <tr>
                                                            <td>&nbsp;</td></tr><tr><td>&nbsp;</td>
                                                          </tr>
                                                          <tr>
                                                            <td>&nbsp;</td>
                                                          </tr>
                                                          <tr>
                                                            <td>&nbsp;</td>
                                                          </tr>
                                                          <tr>
                                                            <td>
                                                              <p style="margin-top:0;padding:0px 50px;color:#013f6a;text-align:center">
                                                                <strong style="padding: 5px 0px;font-size:1.3em;">Verify Email</strong>
                                                              </p>
                                                            </td>
                                                          </tr>
                                                          <tr>
                                                            <td>&nbsp;</td>
                                                          </tr>
                                                          <tr>
                                                            <td>
                                                              <p style="margin-top:0;padding:0px 50px;color:#494949;color:#494949;">
                                                                <strong style="background:#fff;padding: 5px 0px;font-size:1.1em;">Dear User</strong>
                                                              </p>
                                                              <p>&nbsp;</p>
                                                            </td>
                                                          </tr>
                                                          <tr>
                                                            <td style="vertical-align:top;padding:5px 50px;">
                                                              <p style="font-size:16px; color:#494949;margin:0;">HELLO
                                                            WELCOME TO LOCKSIGN</p>
                                                                <p>&nbsp;</p>
                                                            </td>
                                                          </tr>
                                                          <tr>
                                                            <td style="vertical-align:top;padding:0px 50px">
                                                              <p style="font-size:16px; color:#494949;line-height:24px;">Thanks for creating your account with LockSign. Please verify your email by clicking on the link below.</p>
                                                            </td>
                                                          </tr>
                                                          <tr>
                                                            <td style="vertical-align:top;padding:10px 50px"> 
                                                              <a href="`+email_verification_url+`" style="display:inline-block;padding:10px 15px;background:#013f6a;color:#fff;text-decoration:none;border-radius:4px;">Verify Email</a>
                                                            </td>
                                                          </tr>
                                                          <tr>
                                                            <td>&nbsp;</td>
                                                          </tr>
                                                          <tr>
                                                            <td style="font-size:16px;color:#494949;line-height:24px;padding:0 50px;"><strong>Best Regards,</strong><br> LockSign Support Team</td>
                                                          </tr>
                                                          <tr>
                                                            <td>&nbsp;</td>
                                                          </tr>
                                                          <tr>
                                                            <td>&nbsp;</td>
                                                          </tr>
                                                          <tr>
                                                            <td>&nbsp;</td>
                                                          </tr>
                                                          <tr>
                                                            <td>&nbsp;</td>
                                                          </tr>
                                                        </table>
                                                      </td>
                                                    </tr>
                                                    <tr>
                                                      <td style="padding:0;">
                                                        <table style="width:100%; color:#000; font-size:.9em; text-align:center;border-collapse: collapse;padding:20px 0">
                                                          <tr>
                                                            <td>&nbsp;</td>
                                                          </tr>
                                                          <tr>
                                                            <td>&nbsp;</td>
                                                          </tr>
                                                          <tr>
                                                            <td style="padding:5px 20px;"><span style="display:inline-block; padding:0 6px;">Copyright &copy; 2019 LockSign</span>
                                                            </td>
                                                          </tr>
                                                          <tr>
                                                            <td style="padding:5px 20px;">
                                                              <a href="#" style="display:inline-block; color:#000; padding:0 6px;">Privacy Policy</a>
                                                              <a href="#" style="display:inline-block; color:#000; padding:0 6px;">Terms &amp; Conditions</a>
                                                            </td>
                                                          </tr>
                                                          <tr>
                                                            <td>&nbsp;</td>
                                                          </tr>
                                                        </table>
                                                      </td>
                                                    </tr>
                                                  </table>
                                                </div>
                                              </body>
                                            </html>`;
                            let bccAddress = '';
                            sendMail(payloadData.email,bccAddress,'Verify Email', email_html, function (err, res) {
                                if(err){
                                    console.log('ERROR!:',err);
                                }
                                console.log('email results',res)
                            });
                        callback(Utils.AppConstants.STATUS_MSG.SUCCESS.EMAIL_SUCCESS)
                    }
                }
            })
        }
    })
}
var deleteSignature = function(payloadData,callback){

    let condition = {id:payloadData.signature_id};
    UserService.deleteSignature(condition,function(err,result){
        if(err){
            console.log(err)
            callback(Utils.AppConstants.STATUS_MSG.ERROR.IMP_ERROR)
        }else{
            callback(Utils.AppConstants.STATUS_MSG.SUCCESS.DELETED)
        }
    })
}

var signatures = function(payloadData,callback){
    // let user_id= 76 
    // let user_id= payloadData.user_id;
    let document_type = "1";
    let condition = {access_token:payloadData.access_token}
    UserService.getUser(condition,function(err,result){
        if(err){
            console.log(err)
            cb(Utils.AppConstants.STATUS_MSG.ERROR.IMP_ERROR)
        }
        else{
            UserService.getDocument(result.id,document_type,function(err,result){
                if(err){
                    callback(Utils.AppConstants.STATUS_MSG.ERROR.IMP_ERROR)
                }else{
                    callback(null,result)
                }        
            })
        }
    })
}
// cb(null,result)

var primarySignature = function(payloadData,callback){

    let condition = {id:payloadData.signature_id};
    UserService.primarySignature(condition,function(err,result){
        if (err) {
            callback(Utils.AppConstants.STATUS_MSG.ERROR.IMP_ERROR)
        }else{
            callback(Utils.AppConstants.STATUS_MSG.SUCCESS.PRIMARY_SIGNATURE)
        }
    }) 
}

/*var data = [
    {
        'cat_name':'fashion'
    },
    {
        'cat_name':'food'
    }
];*/

var userDocument = function(payloadData,file,callback){

    // console.log("payloadData.user_ids===",payloadData.user_ids);
    var user_ids_array = [];
    let user_email_array = [];
        
    if(payloadData.user_ids){
        let user_ids = (payloadData.user_ids.replace(/"/g, ""));
        let res      = user_ids.split(",");
        let len      = res.length;
        for(let i in res){
            if(Number.isInteger(parseInt(res[i]))){
                user_ids_array.push(parseInt(res[i]));
            }else{
                user_email_array.push(res[i]);
            }
        }
    }
    //console.log("user_ids_array===",user_ids_array);
    //console.log("user_email_array===",user_email_array);

    async.auto({
        findUser: function(cb) {
            let condition={access_token:payloadData.access_token}
            UserService.findUserData(condition,function(err,result){
                if(err){
                    console.log(err)
                    cb(Utils.AppConstants.STATUS_MSG.ERROR.IMP_ERROR)
                }
                else{
                    cb(null,result)
                }
            })
        },
        //Here Document created
        document: ['findUser',function(results,cb) { 
            if(results.findUser == null){
               callback(Utils.AppConstants.STATUS_MSG.ERROR.USER_NOT_FOUND)
            }else{
                user_ids_array.push(results.findUser.id);
                // console.log("user_ids_array======",results.findUser.id);
                // console.log("user_ids_array======",user_ids_array);
                // var user_data = results.findUser;
                if(file){
                    AWS.config.update({
                        accessKeyId: "AKIAZUR4TXH5KRTIQZLX",
                        secretAccessKey: "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"
                    });
                    //console.log("file===",file);
                    var s3 = new AWS.S3();
                    var filePath = file.document.path;
                    //configuring parameters
                    var image_name = '';
                    document_name = Date.now()+"_"+path.basename(filePath);

                    var params = {
                        Bucket: 'locksign-dev',
                        Body : fs.createReadStream(filePath),
                        Key : "document/"+document_name,
                        ACL : 'public-read'
                    };

                    let unique_id = Utils.UniversalFunctions.generateRandomString(16);
                    let imagePath ='https://locksign-dev.s3.amazonaws.com/document/';
                    let image = imagePath+document_name;
                    let document_data={
                        'user_id': results.findUser.id || null,
                        'unique_id':unique_id,
                        'path': image || null,
                        'name': payloadData.name || null,
                        'sha_key': payloadData.sha_key || null,
                        'title': payloadData.title || null,
                        'description': payloadData.description || null,
                        "status":payloadData.status,
                        "need_to_share":payloadData.need_to_share,
                        "is_completed":payloadData.is_completed,
                        "local_doc_id":payloadData.local_doc_id
                    }
                    //"need_to_share":0,
                    //handle error
                    s3.upload(params, function (err, data){
                        if(err){
                           console.log("Error", err);
                        }
                        //success
                        if(data){

                            UserService.createDocument(document_data,function(err,result){
                                console.log(result);
                                if(err){  
                                console.log(err)                          
                                    cb(Utils.AppConstants.STATUS_MSG.ERROR.IMP_ERROR)
                                }
                                else{
                                    cb(null,result)
                                }
                            })
                        }
                    });
                }
            }
        }],

       
        //Here we check user_email_array exist in db or not.
        //if exist then email sent to user's else we created user's account in db and sent email to user 
        check_user_email: ['document',function(data,cb){
            if(data.document == null){
               callback(Utils.AppConstants.STATUS_MSG.ERROR.DOCUMENT_NOT_FOUND)
            }else{
                UserService.findUser(user_email_array,function(err,result){
                    if(err){  
                        console.log(err)                          
                        cb(Utils.AppConstants.STATUS_MSG.ERROR.IMP_ERROR)
                    }
                    else{
                        let user_email_array_length = user_email_array.length;
                        let result_len = result.length;

                        console.log("result_len================",result_len);
                        console.log("user_email_array_length================",user_email_array_length);
                        
                        
                        if(result_len == 0){
                            UserService.createbulkUser(user_email_array,function(err,result){
                                if(err){  
                                    console.log(err)                          
                                    cb(Utils.AppConstants.STATUS_MSG.ERROR.IMP_ERROR)
                                }else{
                                    cb(null,result)
                                    console.log("result_len == 0",result_len)
                                }
                            })
                        }else if(result_len != user_email_array_length){
                            
                            let email_exist = [];
                            let email_not_exist = [];
                            for(let i in result){
                                if(!user_email_array.includes(result[i].email)){
                                    email_not_exist.push(result[i].email);
                                }else{
                                    email_exist.push(result[i].email);
                                }
                            }   

                            console.log("email_not_exist=======",email_not_exist);
                            console.log("email_exist=======",email_exist);
                            UserService.createbulkUser(email_not_exist,function(err,result){
                                if(err){  
                                    console.log("err===",err)                          
                                    cb(Utils.AppConstants.STATUS_MSG.ERROR.IMP_ERROR)
                                }else{
                                    cb(null,result)
                                    console.log("result_len != user_email_array_length",result)                          
                                }
                            })
                        }else  if(result_len == user_email_array_length){
                                console.log("result_len == user_email_array_length===",result)                          
                                cb(null,result)
                        }

                    }
                })
            }            
        }],

        find_user_ids: ['check_user_email',function(data,cb){
            if(data.document == null){
               callback(Utils.AppConstants.STATUS_MSG.ERROR.DOCUMENT_NOT_FOUND)
            }else{
                UserService.findUser(user_email_array,function(err,result){
                    if(err){  
                        console.log(err)                          
                        cb(Utils.AppConstants.STATUS_MSG.ERROR.IMP_ERROR)
                    }
                    else{
                        cb(null,result);
                    }
                })
            }            
        }],

        // document_user: ['findUser','document',function(data,cb) {
        document_user: ['document','find_user_ids',function(data,cb) {

            if(data.document == null){
               callback(Utils.AppConstants.STATUS_MSG.ERROR.DOCUMENT_NOT_FOUND)
            }else{
                console.log("befor user_ids_array======",user_ids_array);
                let new_user_ids = _.without(data.find_user_ids,data.find_user_ids.id);
                user_ids_array.concat(new_user_ids);
                console.log("new_user_ids ====",new_user_ids);
                console.log("after merge user_ids_array====",user_ids_array);

                UserService.assignDocumentToUser(payloadData,data.document.id,user_ids_array,data.findUser.id,function(err,result){
                    if(err){  
                        cb(Utils.AppConstants.STATUS_MSG.ERROR.IMP_ERROR)
                    }
                    else{
                        cb(null,result)
                    }
                })
            }               
        }],

        sent_email: ['findUser','document','document_user','find_user_ids',function(data,cb) {
            if(data.document_user == null){
               callback(Utils.AppConstants.STATUS_MSG.ERROR.USER_NOT_FOUND)
            }else{
                console.log('before user_ids_array==',user_ids_array);
                user_ids_array  = _.without(user_ids_array,data.findUser.id);
                let new_user_ids = _.without(data.find_user_ids,data.find_user_ids.id);
                user_ids_array.concat(new_user_ids);
                console.log('after user_ids_array==',user_ids_array);
                UserService.getDocumentUser(user_ids_array,function(err,result){
                    if(err){  
                        cb(Utils.AppConstants.STATUS_MSG.ERROR.IMP_ERROR)
                    }
                    else{

                        const user_emails = result.map(result => result.email);
                        let document_url = data.document.path;
                        var email_html = `<!DOCTYPE html>
                        <html>
                          <head><title>Verify Email</title><meta charset="utf-8"></head>
                          <body style="margin:0px; padding:0px;">
                            <div style="background: #F8F9FD;padding:50px 10px;">
                              <table style="width:600px;font-family:Helvetica, sans-serif; margin: 0 auto;border-collapse: collapse;letter-spacing:0.7px;">
                                <tr>
                                  <td style="padding:0;">
                                    <table style="width:100%;border-collapse: collapse;" align="center">
                                      <tr>
                                        <td align="center" style="vertical-align:middle; padding:20px 50px;text-align:center;">
                                          <img src=https://locksign-dev.s3.amazonaws.com/project_images/new_logo.png>
                                        </td>
                                      </tr>
                                    </table>
                                  </td>
                                </tr>
                                <tr>
                                  <td>&nbsp;</td>
                                </tr> 
                                <tr>
                                  <td style="padding:0">
                                    <table style="width:100%;border-collapse: collapse;background:#fff;border:1px solid #E7E8F3;">
                                      <tr>
                                        <td>&nbsp;</td></tr><tr><td>&nbsp;</td>
                                      </tr>
                                      <tr>
                                        <td>&nbsp;</td>
                                      </tr>
                                      <tr>
                                        <td>&nbsp;</td>
                                      </tr>
                                      <tr>
                                        <td>
                                          <p style="margin-top:0;padding:0px 50px;color:#013f6a;text-align:center">
                                            <strong style="padding: 5px 0px;font-size:1.3em;">LOCKSIGN: Need Your Signature</strong>
                                          </p>
                                        </td>
                                      </tr>
                                      <tr>
                                        <td>&nbsp;</td>
                                      </tr>
                                      <tr>
                                        <td>
                                          <p style="margin-top:0;padding:0px 50px;color:#494949;color:#494949;">
                                            <strong style="background:#fff;padding: 5px 0px;font-size:1.1em;">Dear User</strong>
                                          </p>
                                          <p>&nbsp;</p>
                                        </td>
                                      </tr>
                                      <tr>
                                        <td style="vertical-align:top;padding:0px 50px">
                                          <p style="font-size:16px; color:#494949;line-height:24px;">We would like to inform you that Locksign needs your signature.</p>
                                        </td>
                                      </tr>
                                      <tr>
                                        <td style="vertical-align:top;padding:10px 50px"> 
                                          <a href="`+document_url+`" style="display:inline-block;padding:10px 15px;background:#013f6a;color:#fff;text-decoration:none;border-radius:4px;">Open Document</a>
                                        </td>
                                      </tr>
                                      <tr>
                                        <td>&nbsp;</td>
                                      </tr>
                                      <tr>
                                        <td style="font-size:16px;color:#494949;line-height:24px;padding:0 50px;"><strong>Best Regards,</strong><br> LockSign Support Team</td>
                                      </tr>
                                      <tr>
                                        <td>&nbsp;</td>
                                      </tr>
                                      <tr>
                                        <td>&nbsp;</td>
                                      </tr>
                                      <tr>
                                        <td>&nbsp;</td>
                                      </tr>
                                      <tr>
                                        <td>&nbsp;</td>
                                      </tr>
                                    </table>
                                  </td>
                                </tr>
                                <tr>
                                  <td style="padding:0;">
                                    <table style="width:100%; color:#000; font-size:.9em; text-align:center;border-collapse: collapse;padding:20px 0">
                                      <tr>
                                        <td>&nbsp;</td>
                                      </tr>
                                      <tr>
                                        <td>&nbsp;</td>
                                      </tr>
                                      <tr>
                                        <td style="padding:5px 20px;"><span style="display:inline-block; padding:0 6px;">Copyright &copy; 2019 LockSign</span>
                                        </td>
                                      </tr>
                                      <tr>
                                        <td style="padding:5px 20px;">
                                          <a href="#" style="display:inline-block; color:#000; padding:0 6px;">Privacy Policy</a>
                                          <a href="#" style="display:inline-block; color:#000; padding:0 6px;">Terms &amp; Conditions</a>
                                        </td>
                                      </tr>
                                      <tr>
                                        <td>&nbsp;</td>
                                      </tr>
                                    </table>
                                  </td>
                                </tr>
                              </table>
                            </div>
                          </body>
                        </html>`;
                        console.log("user_email_array==",user_emails);
                        console.log("user_emails.length==",user_emails.length);
                        if(user_emails && user_emails.length  && user_emails[0] != null){
                            let bccAddress = '';
                            sendMail(user_emails,bccAddress,'LOCKSIGN: Need Your Signature', email_html, function (err, res) {
                                if(err){
                                    console.log('ERROR!:',err);
                                }
                                console.log('email sent',res)
                            });
                        }
                        cb(null,result)
                    }
                })
            }               
        }],
    },
    function(err,result){
        if(err){
            callback(err)
        }
        else{
            callback(null,result)
        }
    })
};

var getDocument = function(payloadData,callback){

    async.auto({
        user: function(cb) {
            let condition={access_token:payloadData.access_token}
            UserService.findUserData(condition,function(err,result){
                if(err){
                    console.log(err)
                    cb(Utils.AppConstants.STATUS_MSG.ERROR.IMP_ERROR)
                }
                else{
                    cb(null,result)
                }
            })
        },
        document: ['user',function(results,cb) {
                // console.log(results.findUser.id);
            if(results.user == null){
               callback(Utils.AppConstants.STATUS_MSG.ERROR.USER_NOT_FOUND)
            }else{
                 UserService.getDocumentNeedSignature(results.user.id,function(err,result){
                    if(err){
                        console.log(err)
                        cb(Utils.AppConstants.STATUS_MSG.ERROR.IMP_ERROR)
                    }
                    else{
                        cb(null,result)
                    }
                })
            }
        }],
    },
    function(err,result){
        if(err){
            callback(err)
        }
        else{
            callback(null,result)
        }
    })
}

var documentStatus = function(payloadData,callback){

    async.auto({
        user: function(cb) {
            let condition={access_token:payloadData.access_token}
            UserService.findUserData(condition,function(err,result){
                if(err){
                    console.log(err)
                    cb(Utils.AppConstants.STATUS_MSG.ERROR.IMP_ERROR)
                }
                else{
                    cb(null,result)
                }
            })
        },
        document: ['user',function(results,cb) {
                // console.log(results.findUser.id);
            if(results.user == null){
               callback(Utils.AppConstants.STATUS_MSG.ERROR.USER_NOT_FOUND)
            }else{
                 UserService.getDocumentStatus(results.user.id,function(err,result){
                    if(err){
                        console.log(err)
                        cb(Utils.AppConstants.STATUS_MSG.ERROR.IMP_ERROR)
                    }
                    else{
                        cb(null,result)
                    }
                })
            }
        }],
    },
    function(err,result){
        if(err){
            callback(err)
        }
        else{
            callback(null,result)
        }
    })
}

var pendingDocumentSign = function(payloadData,callback){

    async.auto({
        user: function(cb) {
            let condition={access_token:payloadData.access_token}
            UserService.findUserData(condition,function(err,result){
                if(err){
                    console.log(err)
                    cb(Utils.AppConstants.STATUS_MSG.ERROR.IMP_ERROR)
                }
                else{
                    cb(null,result)
                }
            })
        },
        document: ['user',function(results,cb) {
                // console.log(results.findUser.id);
            if(results.user == null){
               callback(Utils.AppConstants.STATUS_MSG.ERROR.USER_NOT_FOUND)
            }else{
                 UserService.pendingDocumentSign(results.user.id,function(err,result){
                    if(err){
                        console.log(err)
                        cb(Utils.AppConstants.STATUS_MSG.ERROR.IMP_ERROR)
                    }
                    else{
                        cb(null,result)
                    }
                })
            }
        }],
    },
    function(err,result){
        if(err){
            callback(err)
        }
        else{
            callback(null,result)
        }
    })
}

var updateDocument = function(payloadData,file,callback){

    //const {document_id,sha_key} = req.body;
    async.auto({
        user: function(cb) {
            let condition={access_token:payloadData.access_token}
            UserService.findUserData(condition,function(err,result){
                if(err){
                    console.log(err)
                    cb(Utils.AppConstants.STATUS_MSG.ERROR.IMP_ERROR)
                }
                else{
                    cb(null,result)
                }
            })
        },
        document: ['user',function(results,cb) {
            if(results.user == null){
               callback(Utils.AppConstants.STATUS_MSG.ERROR.USER_NOT_FOUND)
            }else{
                AWS.config.update({
                    accessKeyId: "AKIAZUR4TXH5KRTIQZLX",
                    secretAccessKey: "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"
                });

                var s3 = new AWS.S3();
                var filePath = file.document.path;
                //configuring parameters
                var document_name = '';
                document_name = Date.now()+"_"+path.basename(filePath);

                var params = {
                    Bucket: 'locksign-dev',
                    Body : fs.createReadStream(filePath),
                    Key : "document/"+document_name,
                    ACL : 'public-read'
                };
                console.log("document_name===",document_name);
                console.log("payloadData.sha_key",payloadData.sha_key);
                console.log("payloadData.document_id",payloadData.document_id);

                var document_data={
                    'path': "https://locksign-dev.s3.amazonaws.com/document/"+document_name || null,
                    'sha_key':payloadData.sha_key,
                    'user_id':results.user.id
                }
                //handle error
                s3.upload(params, function (err, data) {
                    if(err){
                       console.log("Error", err);
                    }else{
                        UserService.updateDocument(payloadData.document_id,document_data,function(err,result){
                            console.log(result);
                            if(err){  
                            console.log(err)                          
                                cb(Utils.AppConstants.STATUS_MSG.ERROR.IMP_ERROR)
                            }
                            else{
                                cb(null,result)
                            }
                        })
                    }
                });
            }
        }],
        document_completed: ['user','document',function(results,cb){
            if(results.document == null){
               callback(Utils.AppConstants.STATUS_MSG.ERROR.DOCUMENT_NOT_FOUND)
            }else{
                //handle error
                UserService.updateDocumentStatus(payloadData.document_id,results.user.id,function(err,result){
                    //console.log(result);
                    if(err){  
                        console.log('errrrr',err)                          
                        cb(Utils.AppConstants.STATUS_MSG.ERROR.IMP_ERROR)
                    }
                    else{
                        console.log("document_completed=====",result);
                        cb(null,result)
                    }
                })
            }
        }],
    },
    function(err,result){
        if(err){
            callback(err)
        }
        else{
            callback(null,result)
        }
    })
};

//req.headers.authorization.split(' ')[1];
var userInitial = function(payloadData,file,callback){

    async.auto({
        findUser: function(cb) {
            let condition={access_token:payloadData.access_token}
            UserService.getUser(condition,function(err,result){
                if(err){
                    console.log(err)
                    cb(Utils.AppConstants.STATUS_MSG.ERROR.IMP_ERROR)
                }
                else{
                    cb(null,result)
                }
            })
        },
        signature: ['findUser',function(results,cb) {
            if(results.findUser == null){
               callback(Utils.AppConstants.STATUS_MSG.ERROR.USER_NOT_FOUND)
            }else{
                // var user_data = results.findUser;
                if(file){
                    AWS.config.update({
                        accessKeyId: "AKIAZUR4TXH5KRTIQZLX",
                        secretAccessKey: "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"
                    });

                    var s3 = new AWS.S3();
                    var filePath = file.image.path;
                    //configuring parameters
                    var image_name = '';
                    image_name = Date.now()+"_"+path.basename(filePath);

                    var params = {
                        Bucket: 'locksign-dev',
                        Body : fs.createReadStream(filePath),
                        Key : "User/"+image_name,
                        ACL : 'public-read'
                    };
                    var signature_data={
                        'user_id': results.findUser.id || null,
                        'image': image_name || null,
                        'document_type':"0"
                    }
                    //handle error
                    s3.upload(params, function (err, data) {
                        if(err){
                           console.log("Error", err);
                        }
                        //success
                        if(data){
                            UserService.createSignature(signature_data,function(err,result){
                                console.log(result);
                                if(err){  
                                console.log(err)                          
                                    cb(Utils.AppConstants.STATUS_MSG.ERROR.IMP_ERROR)
                                }
                                else{
                                    cb(null,result)
                                }
                            })
                        }
                    });
                }
            }
        }],
    },
    function(err,result){
        if(err){
            callback(err)
        }
        else{
            callback(null,result)
        }
    })
};

var deleteInitial = function(payloadData,callback){

    let condition = {id:payloadData.initial_id};
    UserService.deleteSignature(condition,function(err,result){
        if(err){
            console.log(err)
            callback(Utils.AppConstants.STATUS_MSG.ERROR.IMP_ERROR)
        }else{
            callback(Utils.AppConstants.STATUS_MSG.SUCCESS.DELETED)
        }
    })
}

var initials = function(payloadData,callback){


    let document_type = "0";
    let condition = {access_token:payloadData.access_token}
    UserService.getUser(condition,function(err,result){
        if(err){
            console.log(err)
            cb(Utils.AppConstants.STATUS_MSG.ERROR.IMP_ERROR)
        }
        else{
            UserService.getDocument(result.id,document_type,function(err,result){
                if(err){
                    callback(Utils.AppConstants.STATUS_MSG.ERROR.IMP_ERROR)
                }else{
                    callback(null,result)
                }        
            })
        }
    })
}

var primaryInitial = function(payloadData,callback){

    let condition = {id:payloadData.initial_id};
    UserService.primarySignature(condition,function(err,result){
        if (err) {
            callback(Utils.AppConstants.STATUS_MSG.ERROR.IMP_ERROR)
        }else{
            callback(Utils.AppConstants.STATUS_MSG.SUCCESS.PRIMARY_INITIAL)
        }
    }) 
}

var userInfo = function(payloadData, callback){
    
    
    let condition={access_token:payloadData.access_token}

    UserService.getUserProfile(condition,function(err,result){
        if(err){
            //console.log(err)
            callback(Utils.AppConstants.STATUS_MSG.ERROR.IMP_ERROR)
        }else{
            if(result == null){
                callback(Utils.AppConstants.STATUS_MSG.ERROR.USER_NOT_FOUND)
            }else{
                //if (result!=null) {
                    if(result.dataValues.image == null){
                        result.dataValues.image = null;
                    }else{
                        result.dataValues.image = s3Url+'User/'+result.dataValues.image;
                    }
                //}
                result.dataValues.app_key = appkey;
                console.log(" result.dataValues.app_key = appkey===",result);
                callback(null,result)
            }
        }
    })
};

var adminInfo = function(payloadData, callback){
    
    if(payloadData.type == 'A'){
        let condition = {};
        UserService.getAdminInfo(condition,function(err,result){
            if(err){
                console.log(err)
                callback(Utils.AppConstants.STATUS_MSG.ERROR.IMP_ERROR)
            }else{
                if(result == null){
                    callback(Utils.AppConstants.STATUS_MSG.SUCCESS.DATA_NOT_FOUND)
                }else{
                    callback(null,result)
                }
            }
        })
    }else if (payloadData.type == 'C') {

        let condition = {};
        UserService.getCms(condition,function(err,result){
            if(err){
                console.log(err)
                callback(Utils.AppConstants.STATUS_MSG.ERROR.IMP_ERROR)
            }else{
                if(result == null){
                    callback(Utils.AppConstants.STATUS_MSG.SUCCESS.DATA_NOT_FOUND)
                }else{
                    callback(null,result)
                }
            }
        })
    }
};

var findUser = function(payloadData, callback){
    
    let condition={access_token:payloadData.access_token}

    UserService.getUser(condition,function(err,result){
        if(err){
            callback(Utils.AppConstants.STATUS_MSG.ERROR.IMP_ERROR)
        }else{
            if(result == null){
                callback(Utils.AppConstants.STATUS_MSG.ERROR.USER_NOT_FOUND)
            }else{
                // console.log("result.id",result.id);
                let condition={email:payloadData.email}
                UserService.searchUser(condition,result.id,function(err,results){
                    if(err){
                        callback(Utils.AppConstants.STATUS_MSG.ERROR.IMP_ERROR)
                    }else{
                        if(results == null){
                            callback(Utils.AppConstants.STATUS_MSG.ERROR.USER_NOT_FOUND)
                        }else{
                            let data = {'userImagePath':user_image_url,'users': results}
                            callback(null,data)
                        }
                    }   
                })
            }
        }
    })
};

var documentInformation = function(payloadData, callback){

    let condition = {'document_id':payloadData.document_id};    
    UserService.getRecentDocument(condition,function(err,result){
        if(err){
            callback(Utils.AppConstants.STATUS_MSG.ERROR.IMP_ERROR)
        }else{
            if(result == null){
                callback(Utils.AppConstants.STATUS_MSG.SUCCESS.DATA_NOT_FOUND)
            }else{
                callback(null,result)
            }
        }
    })
};

var recentDocument = function(payloadData, callback){

    async.auto({
        user: function(cb) {
            let condition={access_token:payloadData.access_token}
            UserService.findUserData(condition,function(err,result){
                if(err){
                    console.log(err)
                    cb(Utils.AppConstants.STATUS_MSG.ERROR.IMP_ERROR)
                }
                else{
                    cb(null,result)
                }
            })
        },
        document: ['user',function(results,cb) {
            console.log("results.user",results.user);
            if(results.user == null){
               callback(Utils.AppConstants.STATUS_MSG.ERROR.USER_NOT_FOUND)
            }else{
                 UserService.getAllRecentDocument(results.user.id,function(err,result){
                    if(err){
                        console.log(err)
                        cb(Utils.AppConstants.STATUS_MSG.ERROR.IMP_ERROR)
                    }
                    else{
                        cb(null,result)
                    }
                })
            }
        }],
    },
    function(err,result){
        if(err){
            callback(err)
        }
        else{
            callback(null,result)
        }
    })
};


var hideDocument = function(payloadData, callback){

    async.auto({
        user: function(cb) {
            let condition={access_token:payloadData.access_token}
            UserService.findUserData(condition,function(err,result){
                if(err){
                    console.log(err)
                    cb(Utils.AppConstants.STATUS_MSG.ERROR.IMP_ERROR)
                }
                else{
                    cb(null,result)
                }
            })
        },
        is_hide: ['user',function(results,cb) {

            if(results.user == null){
               callback(Utils.AppConstants.STATUS_MSG.ERROR.USER_NOT_FOUND)
            }else{
                 UserService.hideDocument(payloadData,function(err,result){
                    if(err){
                        console.log(err)
                        cb(Utils.AppConstants.STATUS_MSG.ERROR.IMP_ERROR)
                    }
                    else{
                        cb(null,result)
                    }
                })
            }
        }],
    },
    function(err,result){
        if(err){
            callback(err)
        }
        else{
            callback(null,result)
        }
    })
};


var favouriteDocument = function(payloadData, callback){

    async.auto({
        user: function(cb) {
            let condition={access_token:payloadData.access_token}
            UserService.findUserData(condition,function(err,result){
                if(err){
                    console.log(err)
                    cb(Utils.AppConstants.STATUS_MSG.ERROR.IMP_ERROR)
                }
                else{
                    cb(null,result)
                }
            })
        },
        is_favourite: ['user',function(results,cb) {

            if(results.user == null){
               callback(Utils.AppConstants.STATUS_MSG.ERROR.USER_NOT_FOUND)
            }else{
                 UserService.favouriteDocument(payloadData,function(err,result){
                    if(err){
                        console.log(err)
                        cb(Utils.AppConstants.STATUS_MSG.ERROR.IMP_ERROR)
                    }
                    else{
                        cb(null,result)
                    }
                })
            }
        }],
    },
    function(err,result){
        if(err){
            callback(err)
        }
        else{
            callback(null,result)
        }
    })
};


var importantDocuments = function(payloadData, callback){

    async.auto({
        user: function(cb) {
            let condition={access_token:payloadData.access_token}
            UserService.findUserData(condition,function(err,result){
                if(err){
                    console.log(err)
                    cb(Utils.AppConstants.STATUS_MSG.ERROR.IMP_ERROR)
                }
                else{
                    cb(null,result)
                }
            })
        },
        important_documents: ['user',function(results,cb) {

            if(results.user == null){
               callback(Utils.AppConstants.STATUS_MSG.ERROR.USER_NOT_FOUND)
            }else{
                 UserService.importantDocument(results.user.id,function(err,result){
                    if(err){
                        console.log(err)
                        cb(Utils.AppConstants.STATUS_MSG.ERROR.IMP_ERROR)
                    }
                    else{
                        cb(null,result)
                    }
                })
            }
        }],
    },
    function(err,result){
        if(err){
            callback(err)
        }
        else{
            callback(null,result)
        }
    })
};


var renameFileName = function(payloadData, callback){

    async.auto({
        user: function(cb) {
            let condition={access_token:payloadData.access_token}
            UserService.findUserData(condition,function(err,result){
                if(err){
                    console.log(err)
                    cb(Utils.AppConstants.STATUS_MSG.ERROR.IMP_ERROR)
                }
                else{
                    cb(null,result)
                }
            })
        },
        rename_document: ['user',function(results,cb) {
            if(results.user == null){
               callback(Utils.AppConstants.STATUS_MSG.ERROR.USER_NOT_FOUND)
            }else{
                 UserService.renameFileName(payloadData,results.user.id,function(err,result){
                    if(err){
                        console.log(err)
                        cb(Utils.AppConstants.STATUS_MSG.ERROR.IMP_ERROR)
                    }
                    else{
                        cb(null,result)
                    }
                })
            }
        }],
    },
    function(err,result){
        if(err){
            callback(err)
        }
        else{
            callback(null,result)
        }
    })
};


var userReminder = function(payloadData, callback){

    var user_ids_array = [];
    let user_ids = (payloadData.user_ids.replace(/"/g, ""));
    let res      = user_ids.split(",");
    for(let i in res){
        user_ids_array.push(parseInt(res[i]));
    }

    async.auto({
        user: function(cb) {
            let condition={access_token:payloadData.access_token}
            UserService.findUserData(condition,function(err,result){
                if(err){
                    console.log(err)
                    cb(Utils.AppConstants.STATUS_MSG.ERROR.IMP_ERROR)
                }
                else{
                    cb(null,result)
                }
            })
        },
        document: ['user',function(data,cb) {
            // console.log('user============================',data.user.id);
            if(data.user.id == null){
               callback(Utils.AppConstants.STATUS_MSG.ERROR.USER_NOT_FOUND)
            }else{
                UserService.getRecentDocument(payloadData,function(err,result){
                    if(err){  
                        cb(Utils.AppConstants.STATUS_MSG.ERROR.IMP_ERROR)
                    }
                    else{
                        cb(null,result)
                    }
                })
            }               
        }],
        user_reminder_email: ['document',function(data,cb) {
        console.log("user_ids_array===",data.document);

            if(data.document == null){
               callback(Utils.AppConstants.STATUS_MSG.ERROR.DOCUMENT_NOT_FOUND)
            }else{
                let document_url = data.document.path;
                UserService.getDocumentUser(user_ids_array,function(err,result){
                    if(err){  
                        cb(Utils.AppConstants.STATUS_MSG.ERROR.IMP_ERROR)
                    }
                    else{
                        const user_emails = result.map(result => result.email);
                        var email_html = `<!DOCTYPE html>
                        <html>
                          <head><title>Verify Email</title><meta charset="utf-8"></head>
                          <body style="margin:0px; padding:0px;">
                            <div style="background: #F8F9FD;padding:50px 10px;">
                              <table style="width:600px;font-family:Helvetica, sans-serif; margin: 0 auto;border-collapse: collapse;letter-spacing:0.7px;">
                                <tr>
                                  <td style="padding:0;">
                                    <table style="width:100%;border-collapse: collapse;" align="center">
                                      <tr>
                                        <td align="center" style="vertical-align:middle; padding:20px 50px;text-align:center;">
                                          <img src=https://locksign-dev.s3.amazonaws.com/project_images/new_logo.png>
                                        </td>
                                      </tr>
                                    </table>
                                  </td>
                                </tr>
                                <tr>
                                  <td>&nbsp;</td>
                                </tr> 
                                <tr>
                                  <td style="padding:0">
                                    <table style="width:100%;border-collapse: collapse;background:#fff;border:1px solid #E7E8F3;">
                                      <tr>
                                        <td>&nbsp;</td></tr><tr><td>&nbsp;</td>
                                      </tr>
                                      <tr>
                                        <td>&nbsp;</td>
                                      </tr>
                                      <tr>
                                        <td>&nbsp;</td>
                                      </tr>
                                      <tr>
                                        <td>
                                          <p style="margin-top:0;padding:0px 50px;color:#013f6a;text-align:center">
                                            <strong style="padding: 5px 0px;font-size:1.3em;">LOCKSIGN: Reminder Email</strong>
                                          </p>
                                        </td>
                                      </tr>
                                      <tr>
                                        <td>&nbsp;</td>
                                      </tr>
                                      <tr>
                                        <td>
                                          <p style="margin-top:0;padding:0px 50px;color:#494949;color:#494949;">
                                            <strong style="background:#fff;padding: 5px 0px;font-size:1.1em;">Dear User</strong>
                                          </p>
                                          <p>&nbsp;</p>
                                        </td>
                                      </tr>
                                      <tr>
                                        <td style="vertical-align:top;padding:0px 50px">
                                          <p style="font-size:16px; color:#494949;line-height:24px;">We would like to inform you that Locksign needs your signature.</p>
                                        </td>
                                      </tr>
                                      <tr>
                                        <td style="vertical-align:top;padding:10px 50px"> 
                                          <a href="`+document_url+`" style="display:inline-block;padding:10px 15px;background:#013f6a;color:#fff;text-decoration:none;border-radius:4px;">Open Document</a>
                                        </td>
                                      </tr>
                                      <tr>
                                        <td>&nbsp;</td>
                                      </tr>
                                      <tr>
                                        <td style="font-size:16px;color:#494949;line-height:24px;padding:0 50px;"><strong>Best Regards,</strong><br> LockSign Support Team</td>
                                      </tr>
                                      <tr>
                                        <td>&nbsp;</td>
                                      </tr>
                                      <tr>
                                        <td>&nbsp;</td>
                                      </tr>
                                      <tr>
                                        <td>&nbsp;</td>
                                      </tr>
                                      <tr>
                                        <td>&nbsp;</td>
                                      </tr>
                                    </table>
                                  </td>
                                </tr>
                                <tr>
                                  <td style="padding:0;">
                                    <table style="width:100%; color:#000; font-size:.9em; text-align:center;border-collapse: collapse;padding:20px 0">
                                      <tr>
                                        <td>&nbsp;</td>
                                      </tr>
                                      <tr>
                                        <td>&nbsp;</td>
                                      </tr>
                                      <tr>
                                        <td style="padding:5px 20px;"><span style="display:inline-block; padding:0 6px;">Copyright &copy; 2019 LockSign</span>
                                        </td>
                                      </tr>
                                      <tr>
                                        <td style="padding:5px 20px;">
                                          <a href="#" style="display:inline-block; color:#000; padding:0 6px;">Privacy Policy</a>
                                          <a href="#" style="display:inline-block; color:#000; padding:0 6px;">Terms &amp; Conditions</a>
                                        </td>
                                      </tr>
                                      <tr>
                                        <td>&nbsp;</td>
                                      </tr>
                                    </table>
                                  </td>
                                </tr>
                              </table>
                            </div>
                          </body>
                        </html>`;
                        //console.log("user_email_array==",user_emails);
                        if(user_emails.length != 0){
                            let bccAddress = user_emails.shift();
                            let user_email = user_emails[0];
                            sendMail(user_email,bccAddress,'LOCKSIGN: Reminder Email', email_html, function (err, res){
                                if(err){
                                    console.log('ERROR!:',err);
                                }
                                console.log('email sent',res)
                            });
                        }
                        cb(null,result)
                    }
                })
            }               
        }],
    },
    function(err,result){
        if(err){
            callback(err)
        }
        else{
            callback(null,result)
        }
    })
};



var PushNotifiation =  function(deviceTokens,callback){


    var fcm = new FCM(fcmKey);
    var message = { //this may vary according to the message type (single recipient, multicast, topic, et cetera)
            to: 'djykLVovEsk:APA91bEgXbXla6StBI6XDvV4cjz86-zruLRouEX2xwliJilWajBwI3mKPJot58p8gCvXRsztvaVQ1RBQjMWOU-TezQSSCE72vB0_IEJ_-wWNgWMJ5IUoaiN5tzxJgfweQraLcDlf_fsx',
            priority: 'high',
            //collapse_key: 'your_collapse_key',

            notification: {
                title: "Locksign",
                body: "Test data"
            },

            data: { //you can send only notification or only data(or include both)
                my_key: 'my value',
                my_another_key: 'my another value'
            }
        };

    fcm.send(message, function(err, response){
        if (err) {
            // callback("Something has gone wrong!",err);
            console.log(err);
        } else {
            console.log(response);
        callback(null,"Successfully sent: ", response);
            // callback(null,"Successfully sent: ", response);
        }
    });


   // console.log(deviceTokens)
/*    try {
        var fcm = new FCM(fcmKey);
        var message = { 
            registration_ids : 'djykLVovEsk:APA91bEgXbXla6StBI6XDvV4cjz86-zruLRouEX2xwliJilWajBwI3mKPJot58p8gCvXRsztvaVQ1RBQjMWOU-TezQSSCE72vB0_IEJ_-wWNgWMJ5IUoaiN5tzxJgfweQraLcDlf_fsx',
            priority: 'high',
            collapse_key: 'your_collapse_key',
           
            notification: { 
               body: 'LockSign assinged document to you.'
            },
            data: {
               notificationTitle: 'LockSign Document',
               notificationMessage:  'Document has been added Successfully.',
            }
        };
           // notificationType:  appConstants.pushNotificationMessages.TRIGGER_SURVEY.notificationType,
        // console.log(message)
        fcm.send(message, function (err, response) {
           if (err) {
               console.log('errrrrr',err)
               // callback(err)
           } else {
               // callback(null,response)
               console.log("Notification has been sent successfully: ", response);
           }
        });
    }catch (e) {
       console.log("========= Error in sending Notification =======", e);
    }

*/





    // note that Sequelize returns token object array, we map it with token value only
    // iOS requires priority to be set as 'high' for message to be received in background
    /*var options = {
        uri: 'https://fcm.googleapis.com/fcm/send',
        method: 'POST',
        headers: { 'Authorization': 'key=' + 'AIzaSyDsL_xl-yL-mVa9RonAlsiCjxbsuIT8DFE' },
        json: {
          'registration_ids': 'djykLVovEsk:APA91bEgXbXla6StBI6XDvV4cjz86-zruLRouEX2xwliJilWajBwI3mKPJot58p8gCvXRsztvaVQ1RBQjMWOU-TezQSSCE72vB0_IEJ_-wWNgWMJ5IUoaiN5tzxJgfweQraLcDlf_fsx',
          'priority': 'high',
          'data': { 'title': "Locksign", 'body': "Locksign document added successfully." }
        }
    };

    request(options, function(error, response, body) {
        if (!error && response.statusCode == 200) {
          console.log("response===",response,"body=============",body)
          callback(null,response)
        } else {
          callback(error)
        }
    });*/
          // response.sendStatus(500);
          // response.sendStatus(200);
}


/*function sendPushNotifiation(deviceToken,callback){

    sendFirebase : async(userId,title,body) =>{
        var message = { //this may vary according to the message type (single recipient, multicast, topic, et cetera)
            to: userId,
            //collapse_key: 'your_collapse_key',

            notification: {
                title: title,
                body: body
            },

            data: { //you can send only notification or only data(or include both)
                my_key: 'my value',
                my_another_key: 'my another value'
            }
        };

        fcm.send(message, function(err, response){
            if (err) {
                cb("Something has gone wrong!");
            } else {
                cb(null,"Successfully sent with response: ", response);
            }
        });    
    }
}
*/

module.exports = {
    signUp: signUp,
    login: login,
    isEmailVerified:isEmailVerified,
    socialMediaSignUp:socialMediaSignUp,
    socialLogin:socialLogin,
    userProfile:userProfile,
    userSignature:userSignature,
    forgotPassword:forgotPassword,
    verifyToken:verifyToken,
    changePassword:changePassword,
    userData:userData,
    resendEmail:resendEmail,
    setPassword:setPassword,
    deleteSignature:deleteSignature,
    signatures:signatures,
    primarySignature:primarySignature,
    initials:initials,
    userInitial:userInitial,
    deleteInitial:deleteInitial,
    primaryInitial:primaryInitial,
    userInfo:userInfo,
    adminInfo:adminInfo,
    userDocument:userDocument,
    findUser:findUser,
    getDocument:getDocument,
    documentStatus:documentStatus,
    pendingDocumentSign:pendingDocumentSign,
    updateDocument:updateDocument,
    documentInformation:documentInformation,
    recentDocument:recentDocument,
    userReminder:userReminder,
    hideDocument:hideDocument,
    favouriteDocument:favouriteDocument,
    importantDocuments:importantDocuments,
    renameFileName:renameFileName,
    PushNotifiation:PushNotifiation
};