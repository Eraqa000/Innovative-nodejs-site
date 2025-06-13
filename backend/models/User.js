import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  name: String,
  avatar: String,
  bio: String,
  cover: String,
  links: [String],
  followers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User', default: [] }],
  following: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User', default: [] }],
  subscribedCourses: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Course', default: [] }]
  // ... другие поля ...
});

export default mongoose.model("User", UserSchema);