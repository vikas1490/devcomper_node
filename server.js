const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const errorHandler = require("./middlewares/error");
const fileUpload = require("express-fileupload");
const cookieParser = require("cookie-parser");

//load env variables

dotenv.config({ path: "./config/config.env" });

connectDB();

// Load Route files

const bootcamps = require("./routes/bootcamp");
const courses = require("./routes/course");
const auth = require("./routes/auth");

const app = express();

app.use(express.json());
app.use(cookieParser());

app.use(fileUpload());

// mount routers

app.use("/api/v1/bootcamps", bootcamps);
app.use("/api/v1/courses", courses);
app.use("/api/v1/auth", auth);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(
  PORT,
  console.log(
    `server running on port ${PORT} and in mode ${process.env.NODE_ENV}`
  )
);
