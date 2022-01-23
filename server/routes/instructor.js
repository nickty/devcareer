const express = require('express')
const { makeInstructor, getAccountStatus, getCurrentInstructor } = require('../controllers/instructor')
const { requireSignin } = require('../middlewares')

const router = express.Router()


router.post('/make-instructor', requireSignin, makeInstructor)
router.post('/get-account-status', requireSignin, getAccountStatus)
router.get('/current-instructor', requireSignin, getCurrentInstructor)


module.exports = router