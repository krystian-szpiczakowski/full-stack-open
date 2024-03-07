const Router = require("express").Router;
const Blog = require("../model/blog");
const User = require("../model/user");

const middleware = require("../middleware/token_extractor");

const jwt = require("jsonwebtoken");

const blogRouter = Router();

blogRouter.get("/", async (request, response) => {
  const blogs = await Blog.find({}).populate("user");
  response.json(blogs);
});

blogRouter.post("/", middleware.extractUser,  async (request, response, next) => {
  const blog = new Blog(request.body);
  
  if (!blog.title) {
    return response.status(400).send({ error: "title is required" });
  }
  
  if (!blog.likes) {
    blog.likes = 0;
  }
  
  const user = await User.findById(request.user.id);  
  if (user) {
    blog.user = user.id;
    const savedBlog = await blog.save();

    user.blogs = user.blogs.concat(savedBlog.id);
    await user.save();

    return response.status(201).json(savedBlog);
  }

  return response.status(401).json({error: "User does not exist"});
});

blogRouter.put("/:id", async (request, response) => {
  const id = request.params.id;
  const likes = Number(request.body.likes);
  console.log("Likes", likes);
  const updatedBlog = await Blog.findByIdAndUpdate(
    id,
    {
      $set: { likes: likes },
    },
    { new: true }
  );

  response.status(200).json(updatedBlog);
});

blogRouter.delete("/:id", middleware.extractUser, async (request, response, next) => {
  const id = request.params.id;
  const blog = await Blog.findById(id);
  if (!blog) {
    return response.sendStatus(204);
  }

  if (blog.user.toString() !== request.user.id) {
    return response.status(403).json({error: "user has no permissions to perform this action"})
  }

  await Blog.findByIdAndDelete(id);

  response.sendStatus(204);
});

blogRouter.use((err, req, res, next) => {
  if (err.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  } else if (err.name === "ValidationError") {
    res.status(400).json(err);
  } else if (err.name === "JsonWebTokenError") {
    return res.status(401).json({ error: err.message })
  }

  next(err)
})

blogRouter.use((err, req, res) => {
  res.status(err.status || 500).json({
    error: {
      message: err.message || 'Internal Server Error',
    },
  });
})

module.exports = blogRouter;
