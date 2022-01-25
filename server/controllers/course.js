const AWS = require('aws-sdk')
const { nanoid } = require('nanoid')

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
    
}