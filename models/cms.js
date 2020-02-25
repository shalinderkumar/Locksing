var Sequelize=require('sequelize');

var cms = sequelize.define('cms', {
	id: {
		type: Sequelize.BIGINT,
		allowNull: false,
		primaryKey: true,
		autoIncrement: true,
		field: 'id'
	},
	tag: {
		type:Sequelize.STRING(20),
		autoNull:true,
		field:'tag'
	},
	description:{
		type:Sequelize.TEXT(),
		autoNull:true,
		field:'description'
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
	tableName: 'cms',
	timestamps: false
});
module.exports = cms;
sequelize.sync();