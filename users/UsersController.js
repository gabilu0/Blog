const express = require('express')
const router = express.Router()
const User = require('./User')
const adminAuth = require('../middlewares/adminAuth')

const bcrypt = require('bcryptjs')

router.get('/admin/users', adminAuth, (request, response) => {
    User.findAll()
        .then(users => {
            response.render('admin/users/index', { users: users })
        })
})

router.get('/admin/users/create', adminAuth, (request, response) => {
    response.render('admin/users/create')
})

router.post('/users/create', (request, response) => {
    const name = request.body.name
    const email = request.body.email
    const password = request.body.password

    User.findOne({ where: { email: email } })
        .then(user => {
            if (user == undefined) { // Verifica se existe usuário definido com esse e-mail

                const salt = bcrypt.genSaltSync(10)
                const hash = bcrypt.hashSync(password, salt)

                User.create({
                    name: name,
                    email: email,
                    password: hash
                }).then(() => response.redirect('/'))
                .catch(error => response.redirect('/'))
            } else {
                response.redirect('/admin/users/create')
            }
        })
})


router.get('/login', (request, response) => {
    response.render('admin/users/login')
})

router.post('/authenticate', (request, response) => {
   
    const email = request.body.email
    const password = request.body.password

    User.findOne({ where: { email: email }})
        .then(user => {
            if (user != undefined) { // Verifica se exite um usuário com esse e-mail
                const correct = bcrypt.compareSync(password, user.password)

                if (correct) {
                    request.session.user = {
                        id: user.id,
                        email: user.email
                    }
                    response.redirect('admin/articles')
                } else {
                    response.redirect('/login')
                }
            } else {
                response.redirect('/login')
            }
        })
})

router.get('/logout', (request, response) => {
    request.session.user = undefined
    response.redirect('/')
})


module.exports = router