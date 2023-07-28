import express, { Application, NextFunction, Request, Response } from 'express'
import cors from 'cors'
import nodeCron from 'node-cron'
import morgan from 'morgan'
import router from './routes/allRoutes'
import globalErrorHandler from './controller/error.controller'
import AppError from './utils/appError'

const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
import { checkWithrawStatus } from './helper/cronHelper'

const VERSION = 'v1'

const app: Application = express()

// Development logging
if (process.env.NODE_ENV === 'development') {
	app.use(morgan('dev'))
}

// app.use(cors());

app.use(
	cors(/* {
    credentials: true,
    origin: ["*"],
    methods: ["GET", "POST", "DELETE", "UPDATE", "PUT", "PATCH"],
    allowedHeaders: ["Authorization", "Content-Type"],
    optionsSuccessStatus: 204,
  } */)
)

app.use(bodyParser.urlencoded({ extended: false }))
app.use(express.json({ limit: '50mb', type: 'application/json' }))
app.use(cookieParser())

app.use(express.static('public/uploads'))

app.use(`/api/${VERSION}`, router)

// This middleware will be called when the user requests for the path which is not defined
app.use('*', (req: Request, res: Response, next: NextFunction) => {
	next(new AppError(`Cannot find the path ${req.originalUrl} on this server`, 404))
})

app.use(globalErrorHandler)

nodeCron.schedule('*/30 * * * * *', () => {
	checkWithrawStatus()
})

export default app
