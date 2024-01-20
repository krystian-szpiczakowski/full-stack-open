import config from "./util/config.js";
import cors from "cors";
import express, { json } from "express";
import { blogRouter } from "./controller/blogs.js";
import { connect } from "mongoose";
const app = express();

connect(config.MONGODB_URI);

app.use(cors());
app.use(json());

app.use("/api/blogs", blogRouter);

export default app;
