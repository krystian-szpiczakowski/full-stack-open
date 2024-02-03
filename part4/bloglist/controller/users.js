const { Router } = require("express");
const bcrypt = require("bcrypt");
const User = require("../model/user");

const userRouter = Router();

userRouter.post("/", async (request, response) => {
  const { name, username, password } = request.body;
  const saltRounds = 10;
  const hashedPassword = await bcrypt.hash(password, saltRounds);

  const userToSave = new User({
    name: name,
    username: username,
    password: hashedPassword,
  });

  const resp = await userToSave.save();
  console.log("Mongo resp", resp);

  const savedUser = { name, username };
  response.status(201).json(savedUser);
});

userRouter.get("/", async (request, response) => {
  const users = await User.find();

  response.json(users);
});

userRouter.get("/:id", async (request, response) => {
  const id = request.params.id;

  try {
    const user = await User.findById(id);
    if (user) {
      return response.json(user);
    }
  } catch (error) {
    console.error(error);
  }

  return response.status(404).json({
    error: `User with id ${id} not found`,
  });
});

module.exports = userRouter;
