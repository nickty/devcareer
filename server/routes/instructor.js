const express = require('express')
const { makeInstructor, getAccountStatus, getCurrentInstructor, instructorCourse, studentCount, instructorBalance, instructorPayoutSettings } = require('../controllers/instructor')
const { requireSignin } = require('../middlewares')

const router = express.Router()


router.post('/make-instructor', requireSignin, makeInstructor)
router.post('/get-account-status', requireSignin, getAccountStatus)
router.get('/current-instructor', requireSignin, getCurrentInstructor)

router.get('/instructor-courses', requireSignin, instructorCourse)

router.post('/instructor/student-count', requireSignin, studentCount)

router.get('/instructor/balance', requireSignin, instructorBalance)
router.get('/instructor/payout-settings', requireSignin, instructorPayoutSettings)


module.exports = router