const User = require('../models/user')
const { hashPassword, comparePassword } = require('../utils/auth')
const jwt = require('jsonwebtoken')

exports.logout = async (req, res) => {
    try {
        res.clearCookie("token")
        return res.json({message: 'Signout success'})
    } catch (error) {
        console.log(error)
    }
}
exports.login = async (req, res) => {
    try {
        //check if our db has user with that email
        const {email, password} = req.body
        const user = await User.findOne({email}).exec()

        if (!user) return res.status(400).send('No user found')

        //check password
        const match = await comparePassword(password, user.password)

        //create signe jwt
        const token = jwt.sign({_id:user._id}, process.env.JWT_SECRET, {expiresIn: '7d'})

        // return user and token to client
        // exclude hash password
        user.password = undefined

        // send token in the cookie
        res.cookie('token', token, {
            httpOnly: true,
            // secure: true
        })
        //send user as json
        res.json(user)

    } catch (error) {
        console.log(error)
        return res.status(400).send('Error. Try again.')
    }
}
exports.register = async (req, res) =>  {
   try {

    console.log(req.body)
    const {name, email, password} = req.body

    //validation
    if(!name) return res.status(400).send('Name is required')
    if(!password || password.length < 6){
        return res.status(400).send('Password is required and should be minimum 6 characters long')
    }
    let userExist = await User.findOne({email}).exec()
    if(userExist) return res.status(400).send('Email is taken')

    //hash password
    const hashedPassword = await hashPassword(password)

    //register
    const user = await new User({
        name, email, password: hashedPassword
    }).save()

    console.log(user)

    return res.json({ok: true})
       
   } catch (error) {
       console.log(error)
       return res.status(400).send('Error, Try Again')
   }
}

exports.currentUser = async (req, res) => {
    try {
        const user = await User.findById(req.user._id).select('-pasword')
        return res.json(user)
    } catch (error) {
        console.log(error)
    }
}