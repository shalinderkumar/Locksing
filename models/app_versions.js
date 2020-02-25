var Sequelize=require('sequelize');

var app_versions = sequelize.define('app_versions', {

	id:{
        type:Sequelize.INTEGER,
        primaryKey:true,
        autoIncrement:true
    },
    app_type:{
        type:Sequelize.TINYINT
    },
    app_version:{
        type:Sequelize.FLOAT
    },
    is_force_update:{
        type:Sequelize.TINYINT
    }
}, {
	tableName: 'app_versions',
	timestamps: false
});
module.exports = app_versions;
sequelize.sync();