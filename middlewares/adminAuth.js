function adminAuth(request, response, next) {
    if (request.session.user !== undefined) { // Foi gerada a sessão
        next()
    } else {
        response.redirect('/login')
    }
}

module.exports = adminAuth