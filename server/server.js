const express = require('express')
const cors = require('cors')
const morgan = require('morgan')
require('dotenv').config()
const {readdirSync} = require('fs')
const mongoose = require('mongoose')
const csrf = require('csurf')
const cookieParser = require('cookie-parser')

const csrfProtection = csrf({cookie: true})

// create express app
const app = express()

// db
mongoose.connect(process.env.Database, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => console.log('DB Connected')).catch((err) => console.log('Error', err))

// apply middleweares
app.use(cors())
app.use(express.json({ limit: '5mb'}))
app.use(cookieParser())
app.use(morgan("dev"))

// route
readdirSync('./routes').map((r) => app.use('/api', require(`./routes/${r}`)))

//csrf
app.use(csrfProtection)

app.get('/api/csrf-token', (req, res) => {
    res.json({ csrfToken : req.csrfToken()})
})

// port
const port = process.env.port || 8000

app.listen(port, () => console.log(`Server is running on port ${port}`))