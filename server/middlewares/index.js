const expressJwt = require('express-jwt')
const User = require('../models/user')
exports.requireSignin = expressJwt({
    getToken: (req, res) => req.cookies.token,
    secret: process.env.JWT_SECRET,
    algorithms: ["HS256"]
    })

exports.isInstructor = async (req, res, next) => {
    try {
        const user = await User.findById(req.user._id)
        if(!user.role.includes('Instructor')){
            return res.sendStatus(403)
        } else {
            next()
        }
    } catch (error) {
        console.log(error)
    }
}