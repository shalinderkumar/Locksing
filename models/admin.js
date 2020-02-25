var Sequelize=require('sequelize');

var admin = sequelize.define('admin', {
	id: {
		type: Sequelize.BIGINT,
		allowNull: false,
		primaryKey: true,
		autoIncrement: true,
		field: 'id'
	},
	name: {
		type:Sequelize.STRING,
		field: 'name'
	},
	phone_no:{
		type:Sequelize.STRING(50),
		autoNull:true,
		field:'phone_no'
	},
	email:{
		type:Sequelize.STRING(50),
		autoNull:true,
		field:'email'
	},
	address:{
		type:Sequelize.STRING(1000),
		autoNull:true,
		field:'address'
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
	tableName: 'admin',
	timestamps: false
});
module.exports = admin;
sequelize.sync();