var Sequelize=require('sequelize');

var users = sequelize.define('users', {
	id: {
		type: Sequelize.BIGINT,
		allowNull: false,
		primaryKey: true,
		autoIncrement: true,
		field: 'id'
	},
	user_id: {
		type: Sequelize.STRING(200),
		allowNull: true,
		field: 'user_id'
	},
	secretKey: {
		type: Sequelize.STRING(200),
		allowNull: true,
		field: 'secret_key'
	},
	email: {
		type: Sequelize.STRING(200),
		allowNull: true,
		field: 'email'
	},
	password: {
		type: Sequelize.STRING(200),
		allowNull: true,
		field: 'password'
	},
	password_reset_token: {
		type: Sequelize.STRING(200),
		allowNull: true,
		defaultValue: '',
		field: 'password_reset_token'
	},
	fb_id: {
		type: Sequelize.STRING(200),
		allowNull: true,
		field: 'fb_id'
	},
	ln_id: {
		type: Sequelize.STRING(200),
		allowNull: true,
		field: 'ln_id'
	},
	g_id: {
		type: Sequelize.STRING(200),
		allowNull: true,
		field: 'g_id'
	},
	image: {
		type: Sequelize.STRING(200),
		allowNull: true,
		field: 'image'
	},
	name: {
		type: Sequelize.STRING(150),
		allowNull: true,
		field: 'name'
	},
	first_name: {
		type: Sequelize.STRING(150),
		allowNull: true,
		field: 'first_name'
	},
	middle_name: {
		type: Sequelize.STRING(150),
		allowNull: true,
		field: 'middle_name'
	},
	last_name: {
		type: Sequelize.STRING(150),
		allowNull: true,
		field: 'last_name'
	},
	country_code: {
		type: Sequelize.INTEGER(5),
		allowNull: true,
		field: 'country_code'
	},
	phone_number: {
		type: Sequelize.STRING(50),
		allowNull: true,
		field: 'phone_number'
	},
	contact_number: {
		type: Sequelize.STRING(50),
		allowNull: true,
		field: 'contact_number'
	},
	dob: {
		type: Sequelize.STRING(20),
		allowNull: true,
		field: 'dob'
	},
	house_number: {
		type: Sequelize.STRING(50),
		allowNull: true,
		field: 'house_number'
	},
	locality: {
		type: Sequelize.STRING(50),
		allowNull: true,
		field: 'locality'
	},
	pincode: {
		type: Sequelize.STRING(50),
		allowNull: true,
		field: 'pincode'
	},
	state: {
		type: Sequelize.STRING(50),
		allowNull: true,
		field: 'state'
	},
	city: {
		type: Sequelize.STRING(50),
		allowNull: true,
		field: 'city'
	},
	country: {
		type: Sequelize.STRING(50),
		allowNull: true,
		field: 'country'
	},
	signature: {
		type: Sequelize.INTEGER(11),
		allowNull: true,
		field: 'signature'
	},
	email_verification_token: {
		type: Sequelize.STRING(255),
		allowNull: true,
		field: 'email_verification_token'
	},
	email_status: {
		type: Sequelize.ENUM('0','1'),
		allowNull: true,
		defaultValue: '0',
		field: 'email_status'
	},
	profile_status: {
		type: Sequelize.ENUM('0','1'),
		allowNull: true,
		defaultValue: '0',
		field: 'profile_status'
	},
	access_token:{
		type:Sequelize.STRING(255),
		autoNull:true,
		field:'access_token'
	},
	device_type:{
		type:Sequelize.TINYINT(10),
		autoNull:true,
		field:'device_type'
	},
	device_token:{
		type:Sequelize.STRING(255),
		autoNull:true,
		field:'device_token'
	},
	created_at:{
        type:Sequelize.DATE,
        defaultValue:Sequelize.NOW(0)
    },
    updated_at:{
        type:Sequelize.DATE,
        defaultValue:Sequelize.NOW(0)
    }
}, {
	tableName: 'users',
	timestamps: false
});
module.exports = users;
sequelize.sync();