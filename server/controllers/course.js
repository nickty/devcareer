const AWS = require('aws-sdk')
const { nanoid } = require('nanoid')
const Course = require('../models/course.js')
const Completed = require('../models/completed.js')
const slugify = require('slugify')
const { readFileSync } = require('fs')
const User = require('../models/user.js')
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY)

const awsConfig = {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_REGION,
    apiVersion : process.env.AWS_API_VERSION
}
const S3 = new AWS.S3(awsConfig)
exports.uploadImage = async (req, res) => {
    try {
        const { image } = req.body
        if(!image) return res.status(400).send('No image')

        //prepare image
        const base64Data = new Buffer.from(image.replace(/^data:image\/\w+;base64,/, ''), 'base64')
       
        const type = image.split(";")[0].split("/")[1]
        console.log(type)
        //image params
        const params = {
            Bucket: 'devcareer',
            Key:`${nanoid()}.${type}`,
            Body: base64Data,
            ACL: 'public-read',
            ContentEncoding: 'base64',
            ContentType: `image/${type}`
        }

        //upload to s3
        S3.upload(params, (err, data) => {
            if(err){
                console.log(err)
                return res.sendStatus(400)
            }
            console.log(data)
            res.send(data)
        })

    } catch (error) {
        console.log(error)
    }
}

exports.removeImage = async (req, res) => {
    try {
        const { image } = req.body

        const params = {
            Bucket: image.Bucket,
            Key: image.Key
        }

        S3.deleteObject(params, (err, data) => {
            if(err){
                console.log(err)
                res.sendStatus(400)
            }
            res.send({ok: true})
        })
    } catch (error) {
        console.log(error)
    }
}

//create course 
exports.create = async (req, res) => {

    try {
        const alreadyExist = await Course.findOne({
            slug: slugify(req.body.name.toLowerCase())
        })
        if(alreadyExist) return res.status(400).send('Title is created')

        const course = await new Course({
            slug: slugify(req.body.name),
            instructor: req.user._id,
            ...req.body
        }).save()

        res.json(course)
    } catch (error) {
        console.log(error)
        return res.status(400).send('Course create failed. Try again!')
    }
}

exports.read = async (req, res) => {
    console.log(req.params.slug)
    try {
        const course = await Course.findOne({slug: req.params.slug}).populate('instructor', '_id name')
        res.json(course)
    } catch (error) {
        console.log(error)
    }
}

exports.uploadVideo = async (req, res) => {
    
    try {
        if(req.user._id != req.params.instructorId) {
            return res.status(400).send('Unauthorized')
        }
        const {video} = req.files;
       if(!video) return res.status(400).send('No video')
       const params = {
        Bucket: 'devcareer',
        Key:`${nanoid()}.${video.type.split('/')[1]}`,
        Body: readFileSync(video.path),
        ACL: 'public-read',
        ContentType: `video/${video.type}`
       }
       S3.upload(params, (err, data) => {
           if(err){
               console.log(err)
               res.sendStatus(400)
           }
           res.send(data)
       })
    } catch (error) {
        console.log(error)
    }
}
exports.uploadRemove = async (req, res) => {
    
    try {
        if(req.user._id != req.params.instructorId) {
            return res.status(400).send('Unauthorized')
        }

        const {Bucket, Key} = req.body;
    //    if(!video) return res.status(400).send('No video')
       const params = {
        Bucket,
        Key
              }
       S3.deleteObject(params, (err, data) => {
           if(err){
               console.log(err)
               res.sendStatus(400)
           }
           res.send({ok: true})
       })
    } catch (error) {
        console.log(error)
    }
}

exports.addLesson = async (req, res) => {
    try {
        const {slug, instructorId} = req.params
        console.log(req.params)
        console.log(req.user._id)
        const {title, content, video} = req.body
        if(req.user._id != instructorId) {
            return res.status(400).send('Unauthorized')
        }

        const updated = await Course.findOneAndUpdate({slug}, {
            $push: {lessons: {title, content, video, slug: slugify(title)}}
        }, {new: true}).populate('instructor', '_id name')
        res.send(updated)
    } catch (error) {
        console.log(error)
        return res.status(400).send('Add lesson failed')
    }
}

exports.update = async (req, res) => {
    try {
        const {slug} = req.params

    const course = await Course.findOne({slug}).select('instructor')

    if(req.user._id != course.instructor._id){
        return res.status(400).send('Unauthorized')
    }

    const updated = await Course.findOneAndUpdate({slug}, req.body, {new: true})
    res.json(updated)
    } catch (error) {
        console.log(error)
        return res.status(400).send(error.message)
    }
}

exports.removeLesson = async (req, res) => {
    try {
        const {slug, lessonId} = req.params

    const course = await Course.findOne({slug})

    if(req.user._id != course.instructor){
        return res.status(400).send('Unauthorized')
    }

    const updated = await Course.findByIdAndUpdate(course._id, {
        $pull : {lessons: { _id: lessonId}}
    })
    res.json({ok: true})
    } catch (error) {
        console.log(error)
        return res.status(400).send(error.message)
    }
}

exports.updateLesson = async (req, res) => {
    try {
        const { slug } = req.params
    const {title, content, video, free_preview, _id} = req.body
    const course = await Course.findOne({slug}).select('instructor').exec()
    if(course.instructor._id != req.user._id){
        return res.status(400).send('Unauthorized')
    }

    const updated = await Course.updateOne({'lessons._id': _id}, {
        $set: {
            "lessons.$.title" : title,
            "lessons.$.content" : content,
            "lessons.$.video" : video,
            "lessons.$.free_preview" : free_preview
        }
    }, {new: true}).exec()

    res.json({ok: true})
    } catch (error) {
        console.log(error)
        return res.status(400).send('Update lesson failed')

    }
}

exports.publishCourse = async (req, res) => {
    try {

        const {courseId} = req.params
    
        const course = await Course.findById(courseId).select('instructor').exec()
    
        if(course.instructor._id != req.user._id){
            return res.status(400).send('Unauthorized')
        }

        const updated = await Course.findByIdAndUpdate(courseId, {published: true}, {new: true})

        res.json(updated)
        
    } catch (error) {
        console.log(error)
        return res.status(400).send('Publish failed')
    }
}
exports.unpublishCourse = async (req, res) => {
    try {

        const {courseId} = req.params

        const course = await Course.findById(courseId).select('instructor').exec()
        if(course.instructor._id != req.user._id){
            return res.status(400).send('Unauthorized')
        }

        const updated = await Course.findByIdAndUpdate(courseId, {published: false}, {new: true})

        res.json(updated)
        
    } catch (error) {
        console.log(error)
        return res.status(400).send('Unpublish failed')
    }
}

exports.courses = async (req, res) => {
    const all = await Course.find({published: true}).populate('instructor', "_id name")

    res.json(all)
}

exports.checkEnrollment = async (req, res) => {
    const { courseId } = req.params
    // console.log(courseId)
    //find cousrse for current user
    const user = await User.findById(req.user._id) 
    // console.log(user)
    //check if course id is found and user courses array
    let ids = []
    let length = user.courses && user.courses.length
    for(let i = 0; i < length; i++){
        ids.push(user.courses[i].toString())
    }

    res.json({
        status: ids.includes(courseId),
        course: await Course.findById(courseId)
    })
}

exports.freeEnrollment = async (req, res) => {
    try {
        //check if course is free or paid
          const course = await Course.findById(req.params.courseId)
          if(course.paid) return
          const result = await User.findByIdAndUpdate(req.user._id, {
              $addToSet: {courses: course._id}
          }, {new : true})

          res.json({
              message: 'Congratulation, Your have succesfully enrolled',
              course: course
          })
    } catch (error) {
        console.log('Free enrollment', error)
        return res.status(400).send('Enrollment create failed')
    }
}
exports.paidEnrollment = async (req, res) => {
    try {
        //check if the course free or paid
    const course = await Course.findById(req.params.courseId).populate('instructor')
    if(!course.paid) return
    
    const fee = (course.price * 30) / 100
    //create stripe session
    const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        //purchase details
        line_items: [
            {
                name: course.name,
                amount: Math.round(course.price.toFixed(2) * 100),
                currency: 'usd',
                quantity: 1
            }
        ],

        //charge buyerand transfer remaining balance to seller
        payment_intent_data: {
            application_fee_amount: Math.round(fee.toFixed(2) * 100),
            transfer_data : {
                destination: course.instructor.stripe_account_id,
            }, 
        },
        //redirect url after successful payment
        success_url : `${process.env.STRIPE_SUCCESS_URL}/${course._id}`,
        cancel_url : `${process.env.STRIPE_CANCEL_URL}`
    })

    await User.findByIdAndUpdate(req.user._id, { stripeSession: session})
    res.send(session.id)
    } catch (error) {
        console.log('Free enrollment', error)
        return res.status(400).send('Enrollment create failed')
    }
}

exports.stripeSuccess = async (req, res) => {
    try {

        //find course
        const course = await Course.findById(req.params.courseId)
        //get user from db to get stripe session id
        const user = await User.findById(req.user._id)

        //if no stripe session, return
        if(!user.stripeSession.id) return res.sendStatus(400)

        //retrieve stripe session
        const session = await stripe.checkout.sessions.retrieve(user.stripeSession.id)

        //if sesson paid fail
        if(session.payment_status === 'paid') {
            await User.findByIdAndUpdate(user._id, {
                $addToSet: {courses: course._id},
                $set: {stripeSession: {}}
            })
        }
        res.json({success: true, course})
    } catch (error) {
       console.log('Stripe success error', error)
       res.json({success: false}) 
    }
}

exports.userCourses = async (req, res) => {
    const user = await User.findById(req.user._id)
    const courses = await Course.find({_id : {$in: user.courses}}).populate('instructor', '_id name')

    res.json(courses)
}

exports.markCompleted = async (req, res) => {
        const { courseId, lessonId} = req.body
        //find if user with that course is already created

        const existing = await Completed.findOne({
            user: req.user._id,
            course: courseId
        })

        if(existing){
            //update
            const updated = await Completed.findOneAndUpdate({
                user: req.user._id, course: courseId
            }, {
                $addToSet: {lessons: lessonId}
            })

            res.json({ok: true})
        }else {
            //create

            const created = await new Completed({

                user: req.user._id, 
                course: courseId, 
                lessons: lessonId
            }).save()

            res.json({ok: true})
        }
}

exports.listCompleted = async (req, res) => {
    try {
        const list = await Completed.findOne({user: req.user._id, course: req.body.courseId})
        list && res.json(list.lessons)
    } catch (error) {
        console.log(error)
    }
}