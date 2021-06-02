const jwt = require('jsonwebtoken')

module.exports = function token(str) {
    return token = jwt.sign({username:str}, 'token')
}


