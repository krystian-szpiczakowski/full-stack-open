const config = require("./util/config");
const cors = require("cors");
const express = require("express");

const loginRouter = require("./controller/login.js");
const blogRouter = require("./controller/blogs.js");
const userRouter = require("./controller/users.js");
const mongoose = require("mongoose");

mongoose.connect(config.MONGODB_URI);
const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/login", loginRouter);
app.use("/api/blogs", blogRouter);
app.use("/api/users", userRouter);

module.exports = app;
