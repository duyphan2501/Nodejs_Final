import express from "express"
import cookieParser from "cookie-parser"
import errorHandeler from "./middlewares/errorHandler.middleware.js"
import dotenv from 'dotenv'
dotenv.config({quiet:true})

const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())
app.use(errorHandeler)

const PORT = process.env.PORT || 3000

app.listen(PORT, () => {
    console.log("Server is running at PORT :::", PORT)
})
