import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import mongoose from "mongoose";


import userRoutes from "./routes/userRoutes.js";
import { notFound, errorHandler } from "./middleware/errorMiddleware.js";

dotenv.config();
const app = express();

const PORT = process.env.PORT || 5000;

//mongoose db connection
import { connectDB } from "./config/db.js";

//custom-middle-ware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended: false}))
app.use(cookieParser())

//routes
app.use("/api/users", userRoutes);

//build in middleware
app.use(notFound);
app.use(errorHandler);

connectDB();

mongoose.connection.once("open", () => {
  console.log("connected to mongodb");
  console.log("Hello marco");
  app.listen(PORT, () => console.log(`server runing on port ${PORT}`));
});
