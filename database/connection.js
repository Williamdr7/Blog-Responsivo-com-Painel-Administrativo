const Sequelize = require("sequelize")
const connection = new Sequelize('blog', 'root', 'fortcamp0100', {
    host: 'localhost',
    dialect: 'mysql'
})


module.exports = connection;