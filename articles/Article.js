const Sequelize = require('sequelize')
const connection = require('../db/database')
const Category = require('../categories/Category')

const Article = connection.define('articles', {
    title: {
        type: Sequelize.STRING,
        allowNull: false 
    },
    slug: {
        type: Sequelize.STRING,
        allowNull: false
    },
    body: {
        type: Sequelize.TEXT,
        allowNull: false
    }
})

Category.hasMany(Article)  // Relacionamento 1 p/ M
Article.belongsTo(Category) // Relacionamento 1 p/ 1 


module.exports = Article