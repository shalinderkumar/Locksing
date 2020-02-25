var SERVER = {
    TOKEN_EXPIRATION_IN_MINUTES: 600,
    JWT_SECRET_KEY: 'M@waad!&^$^&$^%$^%778234534t34Ends',
    GOOGLE_API_KEY : '',
    THUMB_WIDTH : 50,
    THUMB_HEIGHT : 50
};

var STATUS_MSG = {
    ERROR: {
        INVALID_USER_PASS: {
            statusCode:400,
            type: 'INVALID_USER_PASS',
            customMessage : 'Invalid username or password.'
        },
        BOOKING_NOT_FOUND: {
            statusCode:401,
            customMessage : 'Booking not found.',
            type : 'BOOKING_NOT_FOUND'
        },
        SALOON_NOT_FOUND: {
            statusCode:401,
            customMessage : 'Saloon not found.',
            type : 'SALOON_NOT_FOUND'
        },
        OFFER_NOT_FOUND: {
            statusCode:401,
            customMessage : 'Offer not found.',
            type : 'NOT_FOUND'
        },
        INVALID_PROMO_CODE: {
            statusCode:400,
            customMessage : 'Promo Code is Invalid or Expired.',
            type : 'INVALID_PROMO_CODE'
        },
        PROMO_CODE_ERR: {
            statusCode:400,
            customMessage : 'This promo code is not applicable for this service.',
            type : 'PROMO_CODE_ERR'
        },
        IMP_ERROR: {
            statusCode:500,
            customMessage : 'Implementation Error.',
            type : 'IMP_ERROR'
        },
        APP_VERSION_ERROR: {
            statusCode:400,
            customMessage : 'One of the latest version or updated version value must be present.',
            type : 'APP_VERSION_ERROR'
        },
        TOKEN_NOT_FOUND: {
            statusCode:401,
            customMessage : 'Token not found.',
            type : 'INVALID_TOKEN'
        },
        INVALID_TOKEN: {
            statusCode:401,
            customMessage : 'Invalid token provided.',
            type : 'INVALID_TOKEN'
        },
        INVALID_CODE: {
            statusCode:400,
            customMessage : 'Invalid verification code.',
            type : 'INVALID_CODE'
        },
        INVALID_REFERRAL_CODE: {
            statusCode:400,
            customMessage : 'This referral code is not valid.',
            type : 'INVALID_REFERRAL_CODE'
        },
        DEFAULT: {
            statusCode:400,
            customMessage : 'Error',
            type : 'DEFAULT'
        },
        BAD_TOKEN: {
            statusCode:401,
            customMessage : 'Someone else login on another device with your credentials. Please login again to continue. ',
            type : 'BAD_TOKEN'
        },
        PHONE_NO_EXIST: {
            statusCode:400,
            customMessage : 'Phone no. already exist',
            type : 'PHONE_NO_EXIST'
        },
        LINK_EXPIRED: {
            statusCode:400,
            customMessage : 'This link has expired',
            type : 'LINK_EXPIRED'
        },
        ADMIN_EXISTS: {
            statusCode:400,
            customMessage : 'Admin already exists',
            type : 'ADMIN_EXISTS'
        },
        INVALID_EMAIL: {
            statusCode:400,
            customMessage : 'Invalid email address',
            type : 'INVALID_EMAIL'
        },
        PASSWORD_REQUIRED: {
            statusCode:400,
            customMessage : 'Password is required',
            type : 'PASSWORD_REQUIRED'
        },
        INVALID_COUNTRY_CODE: {
            statusCode:400,
            customMessage : 'Invalid country code, Should be in the format +52',
            type : 'INVALID_COUNTRY_CODE'
        },
        INVALID_PHONE_NO_FORMAT: {
            statusCode:400,
            customMessage : 'Phone no. cannot start with 0',
            type : 'INVALID_PHONE_NO_FORMAT'
        },
        COUNTRY_CODE_MISSING: {
            statusCode:400,
            customMessage : 'You forgot to enter the country code',
            type : 'COUNTRY_CODE_MISSING'
        },
        INVALID_PHONE_NO: {
            statusCode:400,
            customMessage : 'Phone no. & country code does not match to which the OTP was sent',
            type : 'INVALID_PHONE_NO'
        },
        PHONE_NO_MISSING: {
            statusCode:400,
            customMessage : 'You forgot to enter the phone no.',
            type : 'PHONE_NO_MISSING'
        },
        USER_NOT_FOUND: {
            statusCode:400,
            customMessage : 'This user is not registered with LockSign.',
        },
        DOCUMENT_NOT_FOUND: {
            statusCode:400,
            customMessage : 'This document not found.',
        },
        INVALID_RESET_PASSWORD_TOKEN: {
            statusCode:400,
            customMessage : 'Invalid reset password token',
            type : 'INVALID_RESET_PASSWORD_TOKEN'
        },
        INCORRECT_PASSWORD: {
            statusCode:400,
            customMessage : 'Your password is incorrect.',
            type : 'INCORRECT_PASSWORD'
        },
        EMPTY_VALUE: {
            statusCode:400,
            customMessage : 'Empty string not allowed',
            type : 'EMPTY_VALUE'
        },
        SAME_PASSWORD: {
            statusCode:400,
            customMessage : 'Old password and new password are same.',
            type : 'SAME_PASSWORD'
        },
        USER_ALREADY_EXIST: {
            statusCode:400,
            customMessage : 'This email address already exists.',
            type : 'USER_ALREADY_EXIST'
        },
        ERROR_PROFILE_PIC_UPLOAD: {
            statusCode:400,
            customMessage : 'Profile picture is not in a valid file',
            type : 'ERROR_PROFILE_PIC_UPLOAD'
        },
        PHONE_ALREADY_EXIST: {
            statusCode:400,
            customMessage : 'Phone no. already exists',
            type : 'PHONE_ALREADY_EXIST'
        },
        EMAIL_NOT_FOUND: {
            statusCode:400,
            customMessage : 'This email address is not registered with us. Please register to continue.',
            type : 'EMAIL_NOT_FOUND'
        },
        EMAIL_NOT_VERIFIED: {
            statusCode:400,
            customMessage : 'Please verify your email first',
            type : 'EMAIL_NOT_VERIFIED'
        },
        USER_BLOCKED: {
            statusCode:401,
            customMessage : 'Your account has been blocked by admin. Please contact with admin for further information.',
            type : 'USER_BLOCKED'
        },
        USER_DELETED: {
            statusCode:401,
            customMessage : 'Your account has been deleted by admin. Please contact with admin for further information.',
            type : 'USER_DELETED'
        },
        PHONE_NOT_FOUND: {
            statusCode:400,
            customMessage : 'Phone no. not found',
            type : 'PHONE_NOT_FOUND'
        },
        INCORRECT_OLD_PASS: {
            statusCode:400,
            customMessage : 'Incorrect old password',
            type : 'INCORRECT_OLD_PASS'
        },
        UNAUTHORIZED: {
            statusCode:401,
            customMessage : 'You are not authorized to perform this action',
            type : 'UNAUTHORIZED'
        },
        EMAIL_ALREADY_VERIFIED: {
            statusCode: 400,
            customMessage: 'Your email has already been verified',
            type: 'EMAIL_ALREADY_VERIFIED'
        },
        EMAIL_ALREADY_SUBSCRIBED: {
            statusCode: 400,
            customMessage: 'This email address has already been subscribed.',
            type: 'EMAIL_ALREADY_SUBSCRIBED'
        },
        INVALID_LINK: {
            statusCode: 400,
            customMessage: 'This link is invalid.',
            type: 'INVALID_LINK'
        },
        SOCIAL_EMAIL: {
            statusCode: 400,
            customMessage: 'This email has been registered as social email',
            type: 'SOCIAL_EMAIL'
        },
        SERVICE_ALREADY_EXIST: {
            statusCode: 400,
            customMessage: 'Service already exists.',
            type: 'SERVICE_ALREADY_EXIST'
        },
        BOOKING_NOT_CANCELLED : {
            statusCode: 400,
            customMessage: 'Booking status has already been changed by saloon.',
            type: 'BOOKING_NOT_CANCELLED'
        },
        BOOKING_NOT_COMPLETED: {
            statusCode: 400,
            customMessage: 'Booking has not been completed yet.',
            type: 'BOOKING_NOT_COMPLETED'
        },
        ALREADY_RATED: {
            statusCode: 400,
            customMessage: 'Feedback already given to this booking .',
            type: 'ALREADY_RATED'
        },
        TIME_ERROR : {
            statusCode: 400,
            customMessage: 'Booking time should be greater than current time.',
            type: 'TIME_ERROR'
        },
        saloonTimeError : {
            statusCode: 400,
            customMessage: 'The saloon has not set start and end time.',
            type: 'saloonTimeError'
        },
        TIME_SLOTS_ERROR : {
            statusCode: 400,
            customMessage: 'The time slot you have selected is not available now.',
            type: 'TIME_SLOTS_ERROR'
        },
        INVALID_SLOTS : {
            statusCode: 400,
            customMessage: 'INVALID SLOTS.',
            type: 'INVALID_SLOTS'
        },
        SALOON_BLOCKED: {
            statusCode:400,
            customMessage : 'Your account has been blocked by admin, Please contact with admin for further information.',
            type : 'SALOON_BLOCKED'
        },
        SALOON_DELETED: {
            statusCode:400,
            customMessage : 'Your account has been deleted by admin, Please contact with admin for further information.',
            type : 'SALOON_DELETED'
        },
    },
    SUCCESS: {
        CREATED: {
            statusCode:201,
            customMessage : 'Created successfully',
            type : 'CREATED'
        },
        DEFAULT: {
            statusCode:200,
            customMessage : 'Success',
            type : 'DEFAULT'
        },
        PROMO_INVALID: {
            statusCode:200,
            customMessage : 'This promo code is invalid. ',
            type : 'DEFAULT'
        },
        UPDATED: {
            statusCode:200,
            customMessage : 'Updated successfully',
            type : 'UPDATED'
        },
        LOGOUT: {
            statusCode:200,
            customMessage : 'Logged out successfully',
            type : 'LOGOUT'
        },
        DELETED: {
            statusCode:200,
            customMessage : 'Deleted successfully',
            type : 'DELETED'
        },
        VERIFIED: {
            statusCode:200,
            customMessage : 'Verified successfully',
            type : 'Verified'
        },
        EMAIL_SUCCESS: {
            statusCode:200,
            customMessage : 'Email sent successfully to your registered email.',
            type : 'EMAIL_SUCCESS'
        },
        USER_FOUND: {
            statusCode:200,
            customMessage : 'User found',
            type : 'USER_FOUND'
        },
        PASSWORD_UPDATED: {
            statusCode:200,
            customMessage : 'Password updated successfully',
            type : 'PASSWORD_UPDATED'
        }, 
        BOOKING_CREATED: {
            statusCode:200,
            customMessage : 'Booking created successfully.',
            type : 'BOOKING_CREATED'
        },
        BOOKING_CANCELLED: {
            statusCode:200,
            customMessage : 'Booking cancelled successfully.',
            type : 'BOOKING_CANCELLED'
        },
        RATING_SUCCESS: {
            statusCode:200,
            customMessage : 'Thank you for your feedback.',
            type : 'RATING_SUCCESS'
        },
        SIGNATURE_LIST: {
            statusCode:200,
            customMessage : 'Signatuer lists.',
            type : 'SIGNATURE_LIST'
        },
        DATA_NOT_FOUND: {
            statusCode:200,
            customMessage : 'Data not found.',
            type : 'DATA_NOT_FOUND'
        },
        PRIMARY_SIGNATURE: {
            statusCode:200,
            customMessage : 'Primary signature has been added successfully.',
            type : 'PRIMARY_SIGNATURE'
        },
        PRIMARY_INITIAL: {
            statusCode:200,
            customMessage : 'Primary initial has been added successfully.',
            type : 'PRIMARY_INITIAL'
        }
    }
};

var notificationMessages = {
    registrationEmail: {
        emailSubject: 'Welcome to Mawaadi',
        emailTemplate: 'Hi,<br>Welcome to Mawaadi. Please click on the following link to verify your email<br>{{verification_url}}'
    },
    forgotPassword: {
        emailSubject: 'Reset Password for Mawaadi.'
    },
    addAdmin: {
        emailSubject: 'Welcome to Mawaadi.'
    },
    subscription_email_user: {
        emailSubject: 'Thanks For Subscribing.'
    },
    contact_us_mawaadi: {
        emailSubject: 'New Message'
    },
    contact_us_user: {
        emailSubject: 'Thanks For Contacting Us'
    }
};

var pushNotificationMessages = {
    BOOKING_SUCCESSFUL: {
        title:'BOOKING SUCCESSFUL.',
        notificationMessage: 'Your booking has been confirmed by saloon.',
        notificationType: 101
    },
    BOOKING_SCHEDULED: {
        title:'BOOKING SCHEDULED.',
        notificationMessage: 'Your booking has been confirmed by saloon.',
        notificationType: 102
    },
    BOOKING_COMPLETED: {
        title:'BOOKING COMPLETED.',
        notificationMessage: 'Your booking has been successfully completed by the saloon. Thank you for giving us an opportuinity to serve you and we look forward to your continued patronage. ',
        notificationType: 103
    },
    BOOKING_CANCELED_USER: {
        title:'BOOKING CANCELED.',
        notificationMessage: 'Your booking has been canceled. Your refund has been initiated.',
        notificationType: 104
    },
    BOOKING_CANCELED_SALOON: {
        title:'BOOKING CANCELED.',
        notificationMessage: 'Your booking has been cancelled by saloon.Your refund has been initiated.',
        notificationType: 104
    },
    BOOKING_DECLINED: {
        title:'BOOKING DECLINED.', 
        notificationMessage: 'Your booking has been declined by saloon. We are very sorry for the inconvenience. Please contact customer support for any further concerns you might have.',
        notificationType: 104
    },
    BOOKING_FAILED: {
        title:'BOOKING FAILED.', 
        notificationMessage: 'Your booking cannot be placed because of payment failure. Please try again after sometime.',
        notificationType: 104
    },
    BOOKING_EXPIRED: {
        title:'BOOKING EXPIRED.', 
        notificationMessage: 'Oops! your booking has expired, find the best deals and book with Mawaadi again!. ',
        notificationType: 104
    },
    RECOMMENDED: {
        title:'RECOMMENDED SALOONS.',
        notificationMessage: 'New saloons have been recommended for you. Kindly review the details.',
        notificationType: 105
    },
    NEW_OFFER: {
        title:'SALOON NEW OFFERS.',
        notificationMessage: 'There are some new offers from the most popular saloons. Kindly review the details. ',
        notificationType: 106
    },
    BROADCAST_PUSH: {
        title:'BROADCAST PUSH.',
        notificationMessage: 'Broadcast message  ',
        notificationType: 107
    }
};

var DATABASE = {
    PROFILE_PIC_PREFIX : {
        ORIGINAL : 'profilePic_',
        THUMB : 'profileThumb_'
    },
    SERVICES_PREFIX : {
        ORIGINAL : 'serviceImage',
        THUMB : 'serviceImageThumb_'
    },
    USER_ROLES: {
        ADMIN: 'ADMIN',
        USER: 'USER',
        CRAWLER: 'CRAWLER',
        EXTENSION: 'EXTENSION'
    },
    FILE_TYPES: {
        LOGO: 'LOGO'
    },
    DEVICE_TYPES: {
        IOS: 'IOS',
        ANDROID: 'ANDROID',
        WEB: 'WEB'
    },
    ADMIN_TYPE: {
        SUPER_ADMIN: 0,
        SUB_ADMIN: 1,
        STAFF: 2
    },
    PLAN_TYPE: {
        QUARTERLY: 'QUARTERLY',
        MONTHLY: 'MONTHLY',
        YEARLY: 'YEARLY'
    }
};

module.exports = {
    STATUS_MSG: STATUS_MSG,
    notificationMessages: notificationMessages,
    pushNotificationMessages: pushNotificationMessages,
    DATABASE: DATABASE,
    SERVER:SERVER
}