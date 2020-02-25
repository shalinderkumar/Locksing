const env = process.env.NODE_ENV || 'local'; // 'development' or 'production' // 'development' or 'production'

const local = {
	app: {
		port: 3050
	},
	db: {
		host: 'localhost',
		mysqlPORT: 3306,
		database: 'LockSign',
		username:'root',
		password:''
	}
};
const config = {
	local
	// production,
};
module.exports = config[env];