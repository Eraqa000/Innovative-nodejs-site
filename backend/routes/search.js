import express from 'express';
import Course from '../models/Course.js';
import User from '../models/User.js';

const router = express.Router();

router.get('/', async (req, res) => {
  const q = req.query.q || "";
  const courseQuery = {
    $or: [
      { title: { $regex: q, $options: "i" } },
      { description: { $regex: q, $options: "i" } }
    ]
  };
  const userQuery = {
    $or: [
      { name: { $regex: q, $options: "i" } },
      { email: { $regex: q, $options: "i" } }
    ]
  };
  const [courses, users] = await Promise.all([
    Course.find(courseQuery).limit(10),
    User.find(userQuery).limit(10)
  ]);
  res.json({ courses, users });
});

export default router;