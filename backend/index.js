import express from "express";
import dotenv from "dotenv";
dotenv.config();
import cookieParser from "cookie-parser";
import connectDb from "./config/db.js";
import cors from "cors";
import authRouter from "./routes/auth.routes.js"
import userRouter from "./routes/user.routes.js"


const app = express();
app.use(cors({
  origin: function (origin, callback) {
    return callback(null, true);
  },
  optionsSuccessStatus: 200,
  credentials: true
}))


const port = process.env.PORT || 5000;
app.use(express.json());
app.use(cookieParser());
app.use("/api/auth", authRouter);
app.use("/api/user", userRouter);


app.get("/", (req, res) => {
  res.send("Virtual Assistant Backend is running!");
});

app.listen(port, () => {
  connectDb();
  console.log(`Server running on port ${port}`);
});