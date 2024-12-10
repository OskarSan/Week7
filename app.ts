import express, {Express} from "express"
import path from "path"

import userRouter from "./src/routes/user"
import morgan from "morgan"
import mongoose, { Connection } from 'mongoose'
import dotenv from "dotenv"


dotenv.config()

const app: Express = express()
const port: number = parseInt(process.env.PORT as string) || 3000

const mongoDB : string = "mongodb://127.0.0.1:27017/testdb"
mongoose.connect(mongoDB)
mongoose.Promise = Promise

const db: Connection = mongoose.connection

db.on('error', console.error.bind(console, 'MongoDB connection error:'))

app.use(express.json())
app.use(express.urlencoded({extended: false}))
app.use(morgan('dev'))

app.use(express.static(path.join(__dirname, '../public')))
app.use("/", userRouter)

app.listen(port, () => {
    console.log(`Server is running on port ${port}`)
})