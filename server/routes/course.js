const express = require('express')
const { uploadImage, removeImage, create, read } = require('../controllers/course')
const { requireSignin, isInstructor } = require('../middlewares')

const router = express.Router()


router.post('/course/upload-image', uploadImage)
router.post('/course/remove-image', removeImage)

//coruse
router.post('/course', requireSignin, isInstructor, create)
router.get('/course/:slug', read)



module.exports = router