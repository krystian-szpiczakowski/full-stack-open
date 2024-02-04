const { Schema, model, default: mongoose } = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

const userSchema = new Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  name: String,
  password: String,
  blogs: [{ type: mongoose.Schema.Types.ObjectId, ref: "Blog" }],
});

userSchema.set("toJSON", {
  transform: (doc, retDoc) => {
    delete retDoc._id;
    delete retDoc.__v;

    retDoc.id = doc._id;
  },
});

userSchema.plugin(uniqueValidator);

const User = model("User", userSchema);

module.exports = User;
