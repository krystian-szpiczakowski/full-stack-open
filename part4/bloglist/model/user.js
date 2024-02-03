const { Schema, model } = require("mongoose");

const userSchema = new Schema({
  username: String,
  name: String,
  password: String,
});

userSchema.set("toJSON", {
  transform: (doc, retDoc) => {
    delete retDoc._id;
    delete retDoc.__v;

    retDoc.id = doc._id;
  },
});

const User = model("User", userSchema);

module.exports = User;
