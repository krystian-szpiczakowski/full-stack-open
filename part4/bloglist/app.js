const config = require('./util/config');
const cors = require('cors');
const express = require('express');

const blogRouter  = require('./controller/blogs.js');
const mongoose = require('mongoose');
const app = express();

mongoose.connect(config.MONGODB_URI);

app.use(cors());
app.use(express.json());

app.use("/api/blogs", blogRouter);

module.exports = app;
