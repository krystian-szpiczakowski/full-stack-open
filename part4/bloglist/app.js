const config = require("./util/config");
const cors = require("cors");
const express = require("express");

const blogRouter = require("./controller/blogs.js");
const userRouter = require("./controller/users.js");
const mongoose = require("mongoose");
const app = express();

mongoose.connect(config.MONGODB_URI);

app.use(cors());
app.use(express.json());

app.use("/api/blogs", blogRouter);
app.use("/api/users", userRouter);

module.exports = app;
