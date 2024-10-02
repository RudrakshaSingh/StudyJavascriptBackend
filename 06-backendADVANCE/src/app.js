import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();

app.use(
  cors({
    origin: "process.env.CORS_ORIGIN", //backend me kiskis jagah se req accept kar raha hu
    credentials: true,
  })
);

app.use(express.json({ limit: "16kb" })); //to accept json data

app.use(express.urlencoded({ extended: true, limit: "16kb" })); //to accept urlencoded data//extended for nested objects

app.use(express.static("public"));//to stores file in folder public like images,pdf

app.use(cookieParser());//server se user ki cookies access and set kar paye


//routes import
import userRouter from "./routes/user.routes.js";

//routes declaration
app.use("/api/v1/users", userRouter);//goes to multile routes in user.routes


export { app };
