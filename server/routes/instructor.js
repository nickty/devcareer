const express = require('express')
const { makeInstructor, getAccountStatus } = require('../controllers/instructor')
const { requireSignin } = require('../middlewares')

const router = express.Router()


router.post('/make-instructor', requireSignin, makeInstructor)
router.post('/get-account-status', requireSignin, getAccountStatus)


module.exports = router