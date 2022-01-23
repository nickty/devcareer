const express = require('express')
const { makeInstructor } = require('../controllers/instructor')
const { requireSignin } = require('../middlewares')

const router = express.Router()


router.post('/make-instructor', requireSignin, makeInstructor)


module.exports = router