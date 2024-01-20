import { Schema, model } from "mongoose";

const blogSchema = new Schema({
  title: String,
  author: String,
  url: String,
  likes: Number,
});

export const Blog = model("Blog", blogSchema);