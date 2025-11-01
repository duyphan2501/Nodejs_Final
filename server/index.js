import express from "express";
import cookieParser from "cookie-parser";
import errorHandeler from "./middlewares/errorHandler.middleware.js";
import dotenv from "dotenv";
import userRouter from "./routes/user.route.js";
import connectToDB from "./database/connectMongoDB.js";
import cors from "cors";
import categoryRouter from "./routes/category.route.js";
import cartRouter from "./routes/cart.route.js";
dotenv.config({ quiet: true });

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(
  cors({
    origin: ["http://localhost:5173", "http://localhost:5174"],
    credentials: true,
  })
);

//routes
app.use("/api/user", userRouter);
app.use("/api/category", categoryRouter);
app.use("/api/cart", cartRouter);

app.use(errorHandeler);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("Server is running at PORT :::", PORT);
  connectToDB();
});
