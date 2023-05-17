const express = require('express')
const slugify = require('slugify')
const router = express.Router()
const Category = require('./Category')
const adminAuth = require('../middlewares/adminAuth')

// Rotas
router.get('/admin/categories/new', adminAuth, (request, response) => {
    response.render('admin/categories/new')
})

router.post('/categories/save', (request, response) => {
    const title = request.body.title
    if (title != undefined) {
        Category.create({
            title: title,
            slug: slugify(title)
        }).then(() => response.redirect('/admin/categories'))
    } else {
        response.redirect('/admin/categories/new')
    }
})

router.get('/admin/categories', adminAuth, (request, response) => {
    Category.findAll()
        .then(category => {
            response.render('admin/categories/index', { categories: category })
        })
})

router.post('/categories/delete', (request, response) => {
    const id = request.body.id

    if (id != undefined && !isNaN(id)) {
        Category.destroy({
            where: { id: id }
        }).then(() => {
            response.redirect('/admin/categories')
        })
    } else {
        response.redirect('/admin/categories')
    }
})

router.get('/admin/categories/edit/:id', adminAuth, (request, response) => {
    const id = request.params.id

    if (isNaN(id)) {
        response.redirect('/admin/categories')
    }

    Category.findByPk(id).then(category => {
        if (category != undefined) {
            response.render('admin/categories/edit', { category: category })
        } else {
            response.redirect('/admin/categories')
        }
    }).catch(error => request.redirect('/admin/categories'))
})

router.post('/categories/update', (request, response) => {
    const id = request.body.id
    const title = request.body.title

    Category.update({ 
        title: title, 
        slug: slugify(title)}, 
        { where: { id: id }}
        ).then(() => {
            response.redirect('/admin/categories')
        })
})

// Exportando modulos
module.exports = router