import { Router } from "express";
import { Schema, model } from 'mongoose';

export const blogRouter = Router();
const blogSchema = new Schema({
  title: String,
  author: String,
  url: String,
  likes: Number,
});

const Blog = model("Blog", blogSchema);

blogRouter.get("/", (request, response) => {
  Blog.find({}).then((blogs) => {
    response.json(blogs);
  });
});

blogRouter.post("/", (request, response) => {
  const blog = new Blog(request.body);

  blog.save().then((result) => {
    response.status(201).json(result);
  });
});