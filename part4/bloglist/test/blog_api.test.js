const mongoose = require("mongoose");
const supertest = require("supertest");
const app = require("../app");
const api = supertest(app);

const Blog = require("../model/blog");
const User = require("../model/user");

const userHelper = require("./user_helper");

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
  await Blog.deleteMany({});
  await Blog.insertMany(initialBlogs);

  await User.deleteMany({});
});

afterAll(async () => {
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

test("only authenticated user can add a blog post", async () => {
  const newBlog = {
    author: "Someone else",
    title: "async/await simplifies making async calls",
    likes: 5,
  };

  await userHelper.createUser("Some Body", "somebodi", "cheese123");
  await userHelper.createUser("Some One-Else", "somebodi_else", "cheese123");

  const token = await userHelper.generateToken("somebodi_else", "cheese123");
  const postResponse = await api
    .post("/api/blogs")
    .set("Authorization", `Bearer ${token}`)
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

  expect(savedBlog.user.name).toBe("Some One-Else");
  expect(savedBlog.user.username).toBe("somebodi_else");
});

test("not authenticated user cannot add a blog post", async () => {
  const newBlog = {
    author: "Someone else",
    title: "async/await simplifies making async calls",
    likes: 5,
  };

  await userHelper.createUser("Some Body", "somebodi", "cheese123");
  const token = await userHelper.generateToken("somebodi_else", "cheese321");
  const postResponse = await api
    .post("/api/blogs")
    .set("Authorization", `Bearer ${token}`)
    .send(newBlog)
    .expect(401)
    .expect("Content-Type", /application\/json/);

  const fetchedBlogs = (await api.get("/api/blogs")).body;
  expect(fetchedBlogs).toHaveLength(initialBlogs.length);
});

test("a new blog has likes set to 0 if missing", async () => {
  const newBlog = {
    author: "Someone else",
    title: "async/await simplifies making async calls",
  };

  await userHelper.createUser("justuser", "justuser", "justpassword");
  const token = await userHelper.generateToken("justuser", "justpassword");
  const postResponse = await api
    .post("/api/blogs")
    .set("Authorization", `Bearer ${token}`)
    .send(newBlog)
    .expect(201)
    .expect("Content-Type", /application\/json/);

  const blogId = postResponse.body.id;
  const fetchedBlogs = (await api.get("/api/blogs")).body;
  const savedBlog = fetchedBlogs.find((blog) => blog.id === blogId);

  expect(savedBlog.likes).toBe(0);
});

test("a new blog requires title", async () => {
  const newBlog = {
    author: "Someone else",
  };

  await userHelper.createUser("Some One-Else", "somebodi_else", "cheese123");
  const token = await userHelper.generateToken("somebodi_else", "cheese123");
  const response = await api
    .post("/api/blogs")
    .set("Authorization", `Bearer ${token}`)
    .send(newBlog)
    .expect(400)
    .expect("Content-Type", /application\/json/);

  expect(response.body.error).toBe("title is required");
});

test("authenticated user can delete their own blog", async () => {
  const newBlog = {
    author: "It's me",
    title: "Authentication is not that hard",
    likes: 5,
  };

  await userHelper.createUser("Test User", "test_user_1", "cheese123");
  const postToken = await userHelper.generateToken("test_user_1", "cheese123");

  const postResponse = await api
    .post("/api/blogs")
    .set("Authorization", `Bearer ${postToken}`)
    .send(newBlog)
    .expect(201)
    .expect("Content-Type", /application\/json/);

  const fetchedBlogs = (await api.get("/api/blogs")).body;
  expect(fetchedBlogs).toHaveLength(initialBlogs.length + 1);

  const deleteToken = await userHelper.generateToken("test_user_1", "cheese123");
  const blogId = postResponse.body.id;
  await api
    .delete(`/api/blogs/${blogId}`)
    .set("Authorization", `Bearer ${deleteToken}`)
    .expect(204);

  const fetchedBlogsAfterDelete = (await api.get("/api/blogs")).body;
  const deletedBlog = fetchedBlogsAfterDelete.find(blog => blog.id === blogId);
  expect(deletedBlog).not.toBeDefined();
});

test("unauthenticated user cannot delete someone else's blog", async () => {
  const newBlog = {
    author: "It's me",
    title: "Authentication is not that hard",
    likes: 5,
  };

  await userHelper.createUser("Test User", "test_user_1", "cheese123");
  await userHelper.createUser("Test User", "test_user_2", "cheese123");
  const postToken = await userHelper.generateToken("test_user_1", "cheese123");

  const postResponse = await api
    .post("/api/blogs")
    .set("Authorization", `Bearer ${postToken}`)
    .send(newBlog)
    .expect(201)
    .expect("Content-Type", /application\/json/);

  const fetchedBlogs = (await api.get("/api/blogs")).body;
  expect(fetchedBlogs).toHaveLength(initialBlogs.length + 1);

  const tokenForAnotherUser = await userHelper.generateToken("test_user_2", "cheese123");
  const blogId = postResponse.body.id;
  const deleteResponse = await api
    .delete(`/api/blogs/${blogId}`)
    .set("Authorization", `Bearer ${tokenForAnotherUser}`)
    .expect(403);

  const deleteError = deleteResponse.body.error;
  expect(deleteError).toBe("user has no permissions to perform this action");

  const fetchedBlogsAfterUnsuccesfulDelete = (await api.get("/api/blogs")).body;
  expect(fetchedBlogsAfterUnsuccesfulDelete).toHaveLength(
    initialBlogs.length + 1
  );
});

test("not authenticated user cannot delete their blog", async () => {
  const newBlog = {
    author: "It's me",
    title: "Authentication is not that hard",
    likes: 5,
  };

  await userHelper.createUser("Test User", "test_user", "cheese123");
  const postToken = await userHelper.generateToken("test_user", "cheese123");

  const postResponse = await api
    .post("/api/blogs")
    .set("Authorization", `Bearer ${postToken}`)
    .send(newBlog)
    .expect(201)
    .expect("Content-Type", /application\/json/);

  const fetchedBlogs = (await api.get("/api/blogs")).body;
  expect(fetchedBlogs).toHaveLength(initialBlogs.length + 1);

  const deleteToken = userHelper.generateToken("test_user", "invalidPassword");
  const blogId = postResponse.body.id;
  await api
    .delete(`/api/blogs/${blogId}`)
    .set("Authorization", `Bearer ${deleteToken}`)
    .expect(401);

  const fetchedBlogsAfterUnsuccesfulDelete = (await api.get("/api/blogs")).body;
  expect(fetchedBlogsAfterUnsuccesfulDelete).toHaveLength(
    initialBlogs.length + 1
  );
});

test("not authenticated user cannot delete someone else's blog", async () => {
  const newBlog = {
    author: "It's me",
    title: "Authentication is not that hard",
    likes: 5,
  };

  await userHelper.createUser("Test User", "test_user_1", "cheese123");
  await userHelper.createUser("Test User", "test_user_2", "cheese123");
  const postToken = await userHelper.generateToken("test_user_1", "cheese123");

  const postResponse = await api
    .post("/api/blogs")
    .set("Authorization", `Bearer ${postToken}`)
    .send(newBlog)
    .expect(201)
    .expect("Content-Type", /application\/json/);

  const fetchedBlogs = (await api.get("/api/blogs")).body;
  expect(fetchedBlogs).toHaveLength(initialBlogs.length + 1);

  const deleteToken = userHelper.generateToken("test_user_2", "invalidPassword");
  const blogId = postResponse.body.id;
  await api
    .delete(`/api/blogs/${blogId}`)
    .set("Authorization", `Bearer ${deleteToken}`)
    .expect(401);

  const fetchedBlogsAfterUnsuccesfulDelete = (await api.get("/api/blogs")).body;
  expect(fetchedBlogsAfterUnsuccesfulDelete).toHaveLength(
    initialBlogs.length + 1
  );
});

test("can update amount of likes for single blog", async () => {
  const newBlog = {
    author: "Someone else",
    title: "async/await simplifies making async calls",
    likes: 5,
  };

  await userHelper.createUser("Some Body", "somebodi", "cheese123");
  const token = await userHelper.generateToken("somebodi", "cheese123");
  const postResponse = await api
    .post("/api/blogs")
    .send(newBlog)
    .set("Authorization", `Bearer ${token}`)
    .expect(201);

  const savedBlog = postResponse.body;
  const blogToUpdate = {
    likes: 8,
  };

  await api
    .put(`/api/blogs/${savedBlog.id}`)
    .send(blogToUpdate)
    .expect(200)
    .expect("Content-Type", /application\/json/);

  const getResponse = await api.get("/api/blogs");
  const updatedBlog = getResponse.body.find((blog) => blog.id === savedBlog.id);

  expect(updatedBlog.likes).toBe(8);
});
