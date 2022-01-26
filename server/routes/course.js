const express = require('express')
const { uploadImage, removeImage, create, read, uploadVideo, uploadRemove, addLesson, update, removeLesson } = require('../controllers/course')
const { requireSignin, isInstructor } = require('../middlewares')
const formidable = require('express-formidable')

const router = express.Router()


router.post('/course/upload-image', uploadImage)
router.post('/course/remove-image', removeImage)

//coruse
router.post('/course', requireSignin, isInstructor, create)
router.put('/course/:slug', requireSignin, update)
router.get('/course/:slug', read)
router.post('/course/video-upload/:instructorId', requireSignin, formidable(), uploadVideo)
router.post('/course/video-remove/:instructorId', requireSignin,  uploadRemove)
router.post('/course/lesson/:slug/:instructorId', requireSignin,  addLesson)
router.put('/course/:slug/:lessonId', requireSignin, removeLesson)



module.exports = router