const supertest = require("supertest");
const app = require("../app");
const api = supertest(app);

const mongoose = require("mongoose");
const User = require("../model/user");

const initialUsers = [
  {
    username: "somebodi_1",
    name: "Abcd_1",
    password: "123123asd",
  },
  {
    username: "somebodi_2",
    name: "Abcd_2",
    password: "aaa",
  },
  {
    username: "somebodi_3",
    name: "Abcd_3",
    password: "jdksfasdf",
  },
];

beforeEach(async () => {
  await User.deleteMany({});
  await User.insertMany(initialUsers);
});

afterAll(async () => {
  await mongoose.connection.close();
});

describe("POST /api/users", () => {
  test("Can create a user", async () => {
    const user = {
      username: "kaka1305",
      name: "Kristiansen",
      password: "ButterChicken123",
    };

    const userResponse = await api
      .post("/api/users")
      .send(user)
      .expect(201)
      .expect("Content-Type", /application\/json/);

    const createdUser = userResponse.body;
    expect(createdUser.username).toBe("kaka1305");
    expect(createdUser.name).toBe("Kristiansen");
    expect(createdUser.password).not.toBeDefined();

    const usersFromDb = await getUsersFromDB();
    expect(usersFromDb).toHaveLength(initialUsers.length + 1);
  });

  test("User's password is hashed", async () => {
    const user = {
      username: "kaka1305",
      name: "Kristiansen",
      password: "ButterChicken123",
    };

    await api
      .post("/api/users")
      .send(user)
      .expect(201)
      .expect("Content-Type", /application\/json/);

    const userFromDb = await getUserFromDB("kaka1305");
    expect(userFromDb.username).toBe("kaka1305");
    expect(userFromDb.password).not.toBe("ButterChicken123");
  });
});

describe("GET /api/users/", () => {
  test("Get information for all users", async () => {
    const response = await api
      .get("/api/users")
      .expect(200)
      .expect("Content-Type", /application\/json/);

    const fetchedUsers = response.body;
    expect(fetchedUsers).toHaveLength(3);

    const fetchedUser = fetchedUsers.find((u) => u.username === "somebodi_3");
    expect(fetchedUser.username).toBe("somebodi_3");
    expect(fetchedUser.name).toBe("Abcd_3");
  });

  test("Get user information by particular ID", async () => {
    const expectedUser = await getUserFromDB("somebodi_1");
    const expectedUserId = expectedUser.id;

    const userResponse = await api
      .get(`/api/users/${expectedUserId}`)
      .expect(200)
      .expect("Content-Type", /application\/json/);

    const actualUser = userResponse.body;
    expect(actualUser.id).toBeDefined();
    expect(actualUser.id).toBe(expectedUserId);
    expect(actualUser.username).toBe("somebodi_1");
    expect(actualUser.name).toBe("Abcd_1");
  });

  test("Get 404 if user with given ID does not exist", async () => {
    const nonExistingId = "nonExistingID"
    const userResponse = await api.get(`/api/users/${nonExistingId}`);

    const error = userResponse.body.error;
    expect(error).toBe("User with id nonExistingID not found");
  });
});

const getUsersFromDB = async () => {
  const users = await User.find({});
  return users;
};

const getUserFromDB = async (username) => {
  return await User.findOne({ username: username });
};
