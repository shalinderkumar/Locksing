var mysql = require('mysql')
const config = require('../config/config');
const Sequelize=require('sequelize');

sequelize = new Sequelize(config.db.database, config.db.username, config.db.password, {
    host: config.db.host,
    dialect: 'mysql',
    port: config.db.mysqlPORT,
    logging: false
});

sequelize.authenticate()
    .then(() => {
        console.log('Connection has been established successfully.');
    })
    .catch(err => {
        console.error('Unable to connect to the database:', err);
});
