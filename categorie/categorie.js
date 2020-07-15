const sequelize = require("sequelize")
const connection = require("../database/connection")

const Category = connection.define('Category', {
    titulo: {
        type: sequelize.STRING,
        allowNull: false,
    },
    slug: {
        type: sequelize.STRING,
        allowNull: false
    }
})



module.exports = Category;