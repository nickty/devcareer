const express = require('express')
const { uploadImage, removeImage } = require('../controllers/course')
const { requireSignin, isInstructor } = require('../middlewares')

const router = express.Router()


router.post('/course/upload-image', uploadImage)
router.post('/course/remove-image', removeImage)

//coruse
router.post('/course', requireSignin, isInstructor, create)



module.exports = router