const express = require('express')
const { uploadImage, removeImage, create, read, uploadVideo, uploadRemove } = require('../controllers/course')
const { requireSignin, isInstructor } = require('../middlewares')
const formidable = require('express-formidable')

const router = express.Router()


router.post('/course/upload-image', uploadImage)
router.post('/course/remove-image', removeImage)

//coruse
router.post('/course', requireSignin, isInstructor, create)
router.get('/course/:slug', read)
router.post('/course/video-upload', requireSignin, formidable(), uploadVideo)
router.post('/course/video-remove', requireSignin,  uploadRemove)



module.exports = router