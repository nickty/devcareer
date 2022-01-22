const express = require('express')
const { register, login, logout, currentUser, sendEmail, forgotPassword } = require('../controllers/auth')
const { requireSignin } = require('../middlewares')

const router = express.Router()


router.post('/register', register)
router.post('/login', login)
router.get('/logout', logout)

router.get('/current-user', requireSignin, currentUser)

router.get('/send-email', sendEmail)

router.post('/forgot-password', forgotPassword)

module.exports = router