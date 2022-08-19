require('dotenv').config()
import express from 'express'
import cors from 'cors'
const cookieParser = require('cookie-parser')
const bodyParser = require('body-parser')
const axios = require('axios')

import authRoutes from './routes/auth'

const morgan = require('morgan')

const app = express()

// middlewares
app.use(cookieParser())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(express.json({ limit: '4mb' }))
app.use(express.urlencoded({ extended: true }))
app.use(cors({ origin: true, credentials: true }))

app.use(morgan('dev'))
// route middlewares
app.use('/', authRoutes)

app.use((err, req, res, next) => {
  // console.log(err)
  res.status(err.status).json(err)
})

app.listen(8000, () => console.log('Server running on port 8000'))
