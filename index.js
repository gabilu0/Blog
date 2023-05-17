const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const connection = require('./db/database')

// Controller
const categoriesController = require('./categories/CategoriesController')
const articlesController = require('./articles/ArticlesController')
const usersController = require('./users/UsersController')

const Article = require('./articles/Article')
const Category = require('./categories/Category')
const User = require('./users/User')

// View engine
app.set('view engine', 'ejs')

// Static
app.use(express.static('public'))

// Body-Parser
app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())

// Conexão com banco
connection
    .authenticate()
    .then( () => console.log('Conectado com Banco de dados!'))
    .catch( error => console.log(error))

// rotas
app.get('/', (require, response) => {
    Article.findAll({
        order: [[ 'id', 'DESC' ]],
        limit: 4
    }).then(articles => {
        Category.findAll()
            .then( categories => {
                response.render('index', { articles: articles,  categories: categories})
            })
        })
})

app.get('/:slug', (request, response) => {
    const slug = request.params.slug
    Article.findOne({
        where: { slug: slug }
    }).then( article => {
        if(article != undefined) {
            Category.findAll()
                .then( categories => {
                    response.render('article', { article: article,  categories: categories })
                })
        } else {
            rensponse.redirect('/')
        }
    }).catch(error => response.redirect('/'))
})

app.get('/category/:slug', (request, response) => {
    const slug = request.params.slug
    
    Category.findOne({
        where: { slug: slug },
        include: [{model: Article}]
    }).then( category => {
        if(category != undefined){
            Category.findAll()
                .then(categories => {
                    response.render('index', { 
                        articles: category.articles, 
                        categories: categories})
                       
                })
        } else {
            response.render('/')
        }
    }).catch(error => {
        response.redirect('/')
    })
})

app.use('/', categoriesController)
app.use('/', articlesController)
app.use('/', usersController)

// Abrindo servidor
app.listen(3000, () => {
    console.log('O servidor está rodando na porta 3000!')
})