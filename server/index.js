import express from "express"
import cookieParser from "cookie-parser"
import errorHandeler from "./middlewares/errorHandler.middleware.js"
import dotenv from 'dotenv'
import userRouter from "./routes/user.route.js"
import adminRoutes from './routes/admin.route.js';
import connectToDB from "./database/connectMongoDB.js"
import cors from "cors"
dotenv.config({quiet:true})

const app = express()

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser())


app.use(cors({
  origin: ["http://localhost:5173", "http://localhost:5174"], 
  credentials: true               
}));

//routes
app.use("/api/user", userRouter)
app.use('/admin', adminRoutes);

app.use(errorHandeler)

const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
    console.log("Server is running at PORT :::", PORT)
    connectToDB()
})
