const app = require("../app");
const supertest = require("supertest");
const api = supertest(app);

const User = require("../model/user");

beforeEach(async () => {
  //await User.deleteMany();
});

describe("POST /api/login", () => {
  test("Returns 401 when passing invalid username", async () => {
    const response = await api
      .post("/api/login")
      .send({
        username: "nonExistingGuy",
        password: "123",
      })
      .expect(401)
      .expect("Content-Type", /application\/json/);

    const error = response.body.error;
    expect(error).toBe("Invalid username or password");
  });

  test("Returns 401 when passing invalid password", async () => {
    await createUser("Some Body", "bodibodi_21", "pasta123");

    const response = await api
      .post("/api/login")
      .send({
        username: "bodibodi_21",
        password: "123",
      })
      .expect(401)
      .expect("Content-Type", /application\/json/);

    const error = response.body.error;
    expect(error).toBe("Invalid username or password");
  });

  test("Authenticated with token when passing valid credentials", async () => {
    await createUser("Some Body", "bodibodi_21", "pasta123");

    const response = await api
      .post("/api/login")
      .send({
        username: "bodibodi_21",
        password: "pasta123",
      })
      .expect(200)
      .expect("Content-Type", /application\/json/);

    const body = response.body;
    expect(body.name).toBe("Some Body");
    expect(body.username).toBe("bodibodi_21");
    expect(body.token).toBeDefined();
  });
});

const createUser = async (name, username, password) => {
  const userToCreate = { name, username, password };
  await api.post("/api/users").send(userToCreate);
};
