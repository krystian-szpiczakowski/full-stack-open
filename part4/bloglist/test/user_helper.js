const supertest = require("supertest");
const app = require("../app");
const api = supertest(app);

const createUser = async (name, username, password) => {
  await api.post("/api/users/").send({ name, username, password });
};

const generateToken = async (username, password) => {
  const response = await api
    .post("/api/login")
    .send({
      username,
      password,
    });

  return response.body.token;
};

module.exports = { createUser, generateToken };
