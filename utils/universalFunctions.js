/**
 * Created by Zubin on 21/12/17.
 */
var MD5 = require('md5');
var randomstring = require("randomstring");

var CryptData = function (stringToCrypt) {
    return MD5(MD5(stringToCrypt));
};

var generateRandomString = function (length) {
    return randomstring.generate(length);
};

var sendSuccess = function sendSuccess (successMsg, data) {
    successMsg = successMsg || Utils.AppConstants.STATUS_MSG.SUCCESS.DEFAULT.customMessage;
    if (typeof successMsg == 'object' && successMsg.hasOwnProperty('statusCode') && successMsg.hasOwnProperty('customMessage')) {
        return {statusCode:successMsg.statusCode, customMessage: successMsg.customMessage, data: data || null};

    }else {
        return {statusCode:200, customMessage: successMsg, data: data || null};
    }
};

var sendError = function sendError (errorMsg, data) {
    errorMsg = errorMsg || Utils.AppConstants.STATUS_MSG.ERROR.DEFAULT.customMessage;
    if(typeof errorMsg == 'object' && errorMsg.hasOwnProperty('statusCode') && errorMsg.hasOwnProperty('customMessage')){
        return {statusCode:errorMsg.statusCode, customMessage: errorMsg.customMessage, type: errorMsg.type || null};
    }else {
        return {statusCode:400, customMessage: errorMsg, type: errorMsg.type || null};
    }
};
// var checkDuplicateValuesInArray = function (array) {
//     console.log('array',array)
//     var storeArray = [];
//     var duplicateFlag = false;
//     if(array && array.length>0){
//         for (var i=0; i<array.length;i++){
//             if (storeArray.indexOf(array[i]) == -1){
//                 console.log('push',array[i])
//                 storeArray.push(array[i])
//             }else {
//                 console.log('break')
//                 duplicateFlag = true;
//                 break;
//             }
//         }
//     }
//     storeArray = [];
//     return duplicateFlag;
// };


// var filterArray = function (array) {
//     return array.filter(function (n) {
//         return n != undefined && n != ''
//     });
// };

module.exports = {
    CryptData: CryptData,
    generateRandomString: generateRandomString,
    sendSuccess :sendSuccess,
    sendError :sendError
};