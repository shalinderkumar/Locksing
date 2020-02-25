var Sequelize=require('sequelize');

var documents = sequelize.define('documents', {
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
	local_doc_id:{
		type:Sequelize.STRING(50),
		autoNull:true,
		field:'local_doc_id'
	},
	unique_id:{
		type:Sequelize.STRING(20),
		autoNull:true,
		field:'unique_id'
	},
	name:{
		type:Sequelize.STRING(255),
		autoNull:true,
		field:'name'
	},
	title:{
		type:Sequelize.STRING(255),
		autoNull:true,
		field:'title'
	},
	description:{
		type:Sequelize.STRING(255),
		autoNull:true,
		field:'description'
	},
	sha_key:{
		type:Sequelize.STRING(255),
		autoNull:true,
		field:'sha_key'
	},
	path:{
		type:Sequelize.STRING(255),
		autoNull:true,
		field:'path'
	},
	status:{
		type:Sequelize.TINYINT(1),
		autoNull:true,
		field:'status'
	},
	is_completed:{
		type:Sequelize.TINYINT(1),
		autoNull:true,
		field:'is_completed'
	},
	need_to_share:{
		type:Sequelize.TINYINT(1),
		autoNull:true,
		field:'need_to_share'
	},
	is_hide:{
		type:Sequelize.TINYINT(1),
		autoNull:true,
		field:'is_hide'
	},
	is_favourite:{
		type:Sequelize.TINYINT(1),
		autoNull:true,
		field:'is_favourite'
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
	tableName: 'documents',
	timestamps: false
});
module.exports = documents;
sequelize.sync();