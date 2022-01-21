const expressJwt = require('express-jwt')

exports.requireSignin = expressJwt({
    getToken: () => geq.cookies.token,
    secret: process.env.JWT_SECRET,
    algorithms: ['HS265']
})