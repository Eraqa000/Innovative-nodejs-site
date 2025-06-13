import mongoose from 'mongoose';

const videoSchema = new mongoose.Schema({
  title: String,
  description: String,
  url: String,
  poster: String,
  uploadedAt: { type: Date, default: Date.now }
});

const courseSchema = new mongoose.Schema({
  title: String,
  description: String,
  posterUrl: String,
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  isPrivate: Boolean,
  allowedSubscriptions: [String],
  videos: [videoSchema],
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('Course', courseSchema);