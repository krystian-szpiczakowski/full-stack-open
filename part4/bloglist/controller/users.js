const { Router } = require("express");
const bcrypt = require("bcrypt");
const User = require("../model/user");

const validate = require("./validation/user_validation");

const userRouter = Router();

userRouter.post("/", async (request, response, next) => {
  const { name, username, password } = request.body;

  var user = { name, username, password };
  const errors = validate(user);
  if (errors.length > 0) {
    return response.status(400).json({
      errors
    });
  }

  const saltRounds = 10;
  const hashedPassword = await bcrypt.hash(password, saltRounds);

  const userToSave = new User({
    ...user,
    password: hashedPassword,
  });

  try {
    await userToSave.save();
    response.status(201).json({ name, username });
  } catch (error) {
    next(error)
  }
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


userRouter.use((err, req, res, next) => {
  console.log(JSON.stringify(err, null, "  "))
  if (err.name === "ValidationError") {
    res.status(400).json(err);
  } else {
    next(err)
  }
})

userRouter.use((err, req, res) => {
  res.status(err.status || 500).json({
    error: {
      message: err.message || 'Internal Server Error',
    },
  });
})

module.exports = userRouter;
