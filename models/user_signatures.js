var Sequelize=require('sequelize');

var user_signatures = sequelize.define('user_signatures', {
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
	image:{
		type:Sequelize.STRING(255),
		autoNull:true,
		field:'image'
	},
	document_type:{
		type:Sequelize.ENUM('0','1'),
		autoNull:true,
		field:'document_type'
	},
	is_primary:{
		type:Sequelize.ENUM('0','1'),
		autoNull:true,
		field:'is_primary'
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
	tableName: 'user_signatures',
	timestamps: false
});
module.exports = user_signatures;
sequelize.sync();