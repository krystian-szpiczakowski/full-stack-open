const Router = require("express").Router;
const Blog = require("../model/blog");
const User = require("../model/user");

const blogRouter = Router();

blogRouter.get("/", async (request, response) => {
  const blogs = await Blog.find({}).populate("user");
  response.json(blogs);
});

blogRouter.post("/", async (request, response) => {
  const blog = new Blog(request.body);
  
  if (!blog.title) {
    return response.status(400).send({ error: "title is required" });
  }
  
  if (!blog.likes) {
    blog.likes = 0;
  }
  
  const user = await User.findOne(); 
  blog.user = user?.id;
  const savedBlog = await blog.save();
  
  if (user) {
    user.blogs = user.blogs.concat(savedBlog.id);
  }

  response.status(201).json(savedBlog);
});

blogRouter.put("/:id", async (request, response) => {
  const id = request.params.id;
  const likes = Number(request.body.likes);
  const updatedBlog = await Blog.findByIdAndUpdate(
    id,
    {
      $set: { likes: likes },
    },
    { new: true }
  );

  response.status(200).json(updatedBlog);
});

blogRouter.delete("/:id", async (request, response) => {
  const id = request.params.id;
  await Blog.findByIdAndDelete(id);

  response.sendStatus(204);
});

module.exports = blogRouter;
