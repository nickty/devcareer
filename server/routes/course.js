const express = require('express')
const { uploadImage, removeImage } = require('../controllers/course')
const { requireSignin } = require('../middlewares')

const router = express.Router()


router.post('/course/upload-image', uploadImage)
router.post('/course/remove-image', removeImage)



module.exports = router