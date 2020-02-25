var Sequelize=require('sequelize');
var document_users = sequelize.define('document_users', {
	id: {
		type: Sequelize.BIGINT,
		allowNull: false,
		primaryKey: true,
		autoIncrement: true,
		field: 'id'
	},
	document_id: {
		type:Sequelize.BIGINT,
        references: {
          model: 'documents', // name of Target model
          key: 'id', // key in Target model that we're referencing
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
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
	file_name:{
		type:Sequelize.STRING(255),
		autoNull:true,
		field:'file_name'
	},
	sign_status:{
		type:Sequelize.TINYINT(255),
		autoNull:true,
		field:'sign_status'
	},
	is_owner:{
		type:Sequelize.TINYINT(255),
		autoNull:true,
		field:'is_owner'
	},
	hide_unhide:{
		type:Sequelize.TINYINT(255),
		autoNull:true,
		field:'hide_unhide'
	},
	folder_id:{
		type:Sequelize.BIGINT(255),
		autoNull:true,
		field:'folder_id'
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
	tableName: 'document_users',
	timestamps: false
});
module.exports = document_users;
sequelize.sync();