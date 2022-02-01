const User = require('../models/user')
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY)
const queryString = require('query-string')
const Course = require('../models/course.js')

exports.getAccountStatus = async (req, res) => {
    try {
        const user = await User.findById(req.user._id).exec()
        const account = await stripe.accounts.retrieve(user.stripe_account_id)

        if(!account.charges_enabled){
            return res.status(401).send("Unauthorized")
        } else {
            const statusUpdated = await User.findByIdAndUpdate(user._id, {
                stripe_seller : account,
                $addToSet: {role: 'Instructor'}
            }, { new: true }).select('-password')

            res.json(statusUpdated)
        }
    } catch (error) {
        console.log(err)
    }
}

exports.makeInstructor = async (req, res) => {
    try {
        const user = await User.findById(req.user._id).exec()

    if(!user.stripe_account_id){
        const account = await stripe.accounts.create({type: 'express'})
        user.stripe_account_id = account.id
        user.save()
    }

    let accountLink = await stripe.accountLinks.create({
        account: user.stripe_account_id,
        refresh_url: process.env.STRIPE_REDIRECT_URL,
        return_url: process.env.STRIPE_REDIRECT_URL,
        type: 'account_onboarding'
    })

    accountLink = Object.assign(accountLink, {
        'stripe_user[email]': user.email
    })

    res.send(`${accountLink.url}?${queryString.stringify(accountLink)}`)
    } catch (error) {
        console.log(error)
    }
}

exports.getCurrentInstructor = async (req, res) => {
    try {
        let user = await User.findById(req.user._id).select('-password').exec()

        if(!user.role.includes('Instructor')) {
            return res.sendStatus(403)
        } else {
            res.json({ok: true})
        }
      
    } catch (error) {
        console.log(error)
    }
}

exports.instructorCourse = async (req, res) => {
    try {
        const courses = await Course.find({instructor:req.user._id}).sort({createdAt: -1})

        res.json(courses)
    } catch (error) {
        console.log(err)
    }
}

exports.studentCount = async (req, res) => {
    try {
        const users = await User.find({courses: req.body.courseId}).select('_id')
        res.json(users)
    } catch (error) {
        console.log(error)
    }
}