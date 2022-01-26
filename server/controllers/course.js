const AWS = require('aws-sdk')
const { nanoid } = require('nanoid')
const Course = require('../models/course.js')
const slugify = require('slugify')
const { readFileSync } = require('fs')

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
        if(req.use._id != req.params.instructorId) {
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
        if(req.use._id != req.params.instructorId) {
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