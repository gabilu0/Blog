const express = require('express')
const router = express.Router()
const User = require('./User')

const bcrypt = require('bcryptjs')

router.get('/admin/users', (request, response) => {
    User.findAll()
        .then(users => {
            response.render('admin/users/index', { users: users })
        })
})

router.get('/admin/users/create', (request, response) => {
   response.render('admin/users/create')
})

router.post('/users/create', (request, response) => {
    const name = request.body.name
    const email = request.body.email
    const password = request.body.password

    User.findOne({
        where: { email: email }
    }).then( user => {
        if( user === undefined) {
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


module.exports = router