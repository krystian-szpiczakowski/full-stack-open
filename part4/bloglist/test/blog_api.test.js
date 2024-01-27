const mongoose = require("mongoose");
const supertest = require("supertest");
const logger = require("../util/logger");
const app = require("../app");

const api = supertest(app);
const Blog = require("../model/blog");

const initialBlogs = [
  {
    author: "Christiansen",
    title: "HTML is easy",
    likes: 101,
  },
  {
    author: "Christiansen",
    title: "To be or not to beeee?",
    likes: 25,
  },
];

beforeEach(async () => {
  logger.info("--- Executing beforeEach");
  await Blog.deleteMany({});
  await Blog.insertMany(initialBlogs);
});

afterAll(async () => {
  logger.info("--- Closing MongoDB connection");
  await mongoose.connection.close();
});

test("blogs are returned as json", async () => {
  await api
    .get("/api/blogs")
    .expect(200)
    .expect("Content-Type", /application\/json/);
});

test("all blogs are returned", async () => {
  const response = await api.get("/api/blogs");
  expect(response.body).toHaveLength(initialBlogs.length);
});

test("Blog contains id property", async () => {
  const response = await api.get("/api/blogs");
  const blog = response.body[0];
  expect(blog.id).toBeDefined();
});

test("a specific blog is within the returned blogs", async () => {
  const response = await api.get("/api/blogs");
  const titles = response.body.map((blog) => blog.title);

  expect(titles).toContain("HTML is easy");
});

test("a valid blog can be added", async () => {
  const newBlog = {
    author: "Someone else",
    title: "async/await simplifies making async calls",
    likes: 5,
  };

  const postResponse = await api
    .post("/api/blogs")
    .send(newBlog)
    .expect(201)
    .expect("Content-Type", /application\/json/);

  const fetchedBlogs = (await api.get("/api/blogs")).body;
  expect(fetchedBlogs).toHaveLength(initialBlogs.length + 1);

  const blogId = postResponse.body.id;
  const savedBlog = fetchedBlogs.find((blog) => blog.id === blogId);
  expect(savedBlog.author).toBe("Someone else");
  expect(savedBlog.title).toBe("async/await simplifies making async calls");
  expect(savedBlog.likes).toBe(5);
});

test("a new blog has likes set to 0 if missing", async () => {
  const newBlog = {
    author: "Someone else",
    title: "async/await simplifies making async calls",
  };

  const postResponse = await api
    .post("/api/blogs")
    .send(newBlog)
    .expect(201)
    .expect("Content-Type", /application\/json/);

  const blogId = postResponse.body.id;
  const fetchedBlogs = (await api.get("/api/blogs")).body;
  const savedBlog = fetchedBlogs.find((blog) => blog.id === blogId);

  expect(savedBlog.likes).toBe(0);
});

test("a new blog has likes set to 0 if missing", async () => {
  const newBlog = {
    author: "Someone else",
    title: "async/await simplifies making async calls",
  };

  const response = await api
    .post("/api/blogs")
    .send(newBlog)
    .expect(201)
    .expect("Content-Type", /application\/json/);

  expect(response.body.likes).toBe(0);
});

test("a new blog requires title", async () => {
  const newBlog = {
    author: "Someone else",
  };

  const response = await api
    .post("/api/blogs")
    .send(newBlog)
    .expect(400)
    .expect("Content-Type", /application\/json/);

  expect(response.body.error).toBe("title is required");
});

test("can delete a single blog", async () => {
  const getResponse = await api.get("/api/blogs");
  const blogToDelete = getResponse.body[0];
  await api.delete(`/api/blogs/${blogToDelete.id}`).expect(204);

  const getResponseAfterDelete = await api.get("/api/blogs");
  const blogs = getResponseAfterDelete.body;
  const deletedBlog = blogs.find((blog) => blog.id === blogToDelete.id);
  expect(deletedBlog).not.toBeDefined();
});

test("can update amount of likes for single blog", async () => {
  const newBlog = {
    author: "Someone else",
    title: "async/await simplifies making async calls",
    likes: 5,
  };

  const postResponse = await api
    .post("/api/blogs")
    .send(newBlog)

  const savedBlog = postResponse.body;

  const blogToUpdate = {
    likes: 8
  }

  await api
    .put(`/api/blogs/${savedBlog.id}`)
    .send(blogToUpdate)
    .expect(200)
    .expect("Content-Type", /application\/json/);

  const getResponse = await api.get("/api/blogs");
  const updatedBlog = getResponse.body.find(blog => blog.id === savedBlog.id);

  expect(updatedBlog.likes).toBe(8);
});