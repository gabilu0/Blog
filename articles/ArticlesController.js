const express = require('express')
const router = express.Router()
const Category = require('../categories/Category')
const Article = require('./Article')
const slugify = require('slugify')

// Rotas
router.get('/admin/articles', (request, response) => {
    Article.findAll({
        include: [{ model: Category }]
    }).then(articles => {
        response.render('admin/articles', { articles: articles })
    })

})

router.get('/admin/articles/new', (request, response) => {
    Category.findAll()
        .then(categories => (
            response.render('admin/articles/new', { categories: categories })
        ))
})

router.post('/articles/save', (request, response) => {
    const title = request.body.title
    const body = request.body.body
    const category = request.body.category

    Article.create({
        title: title,
        slug: slugify(title),
        body: body,
        categoryId: category
    }).then(() => {
        response.redirect('/admin/articles')
    })
})

router.post('/articles/delete', (request, response) => {
    const id = request.body.id

    if (id != undefined && !isNaN(id)) {
        Article.destroy({
            where: { id: id }
        }).then(() => {
            response.redirect('/admin/articles')
        })
    } else {
        response.redirect('/admin/articles')
    }
})

router.get('/admin/articles/edit/:id', (request, response) => {
    const id = request.params.id

    Article.findByPk(id)
        .then(article => {
            if (article != undefined) {
                Category.findAll()
                    .then(categories => {
                        response.render('admin/articles/edit', { categories: categories })
                    })
            }
        }).catch(error => {
            response.redirect('/admin/articles')
        })
})

module.exports = router