var Sequelize=require('sequelize');

var user_sessions = sequelize.define('user_sessions', {
	id: {
		type: Sequelize.BIGINT,
		allowNull: false,
		primaryKey: true,
		autoIncrement: true,
		field: 'id'
	},
	user_id: {
		type:Sequelize.BIGINT,
        references: {
          model: 'users', // name of Target model
          key: 'id', // key in Target model that we're referencing
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
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
    }
}, {
	tableName: 'user_sessions',
	timestamps: false
});
module.exports = user_sessions;
sequelize.sync();