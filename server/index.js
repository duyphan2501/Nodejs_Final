import express from "express"
import cookieParser from "cookie-parser"
import errorHandeler from "./middlewares/errorHandler.middleware.js"
import dotenv from 'dotenv'
import userRouter from "./routes/user.route.js"
import connectToDB from "./database/connectMongoDB.js"
import session from "express-session"
dotenv.config({quiet:true})

const app = express()

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser())
app.use(
  session({
    secret: process.env.SESSION_SECRET_KEY, 
    resave: false,             
    saveUninitialized: false,  
    cookie: {
      maxAge: 1000 * 60 * 60 * 24 * 7,  
      secure: false,          
      httpOnly: true,          
    },
  })
);

//routes
app.use("/api/v1/user", userRouter)

app.use(errorHandeler)

const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
    console.log("Server is running at PORT :::", PORT)
    connectToDB()
})
