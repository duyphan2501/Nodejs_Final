import express from "express";
import cookieParser from "cookie-parser";
import errorHandeler from "./middlewares/errorHandler.middleware.js";
import dotenv from "dotenv";
import userRouter from "./routes/user.route.js";
import connectToDB from "./database/connectMongoDB.js";
import cors from "cors";
import categoryRouter from "./routes/category.route.js";
import path from "path";
import cartRouter from "./routes/cart.route.js";
import adminRoutes from "./routes/admin.route.js";
import couponRouter from "./routes/coupon.route.js";
import productRouter from "./routes/product.route.js";

import orderRouter from "./routes/order.route.js";

import { startNgrokAndConfirmWebhook } from "./config/payos.init.js";
import addressRouter from "./routes/address.route.js";

dotenv.config({ quiet: true });

const app = express();

app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

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
app.use("/api/order", orderRouter);
app.use("/api/product", productRouter);

app.use("/api/address", addressRouter);

app.use("/api/coupon", couponRouter);

app.use(errorHandeler);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("Server is running at PORT :::", PORT);
  connectToDB();

  //startNgrokAndConfirmWebhook();
});
