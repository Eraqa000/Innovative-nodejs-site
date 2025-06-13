import express from 'express';
import bcrypt from 'bcrypt';
import User from '../models/User.js';
import multer from 'multer';
import path from 'path';

const router = express.Router();

// Настройка multer для загрузки файлов
const upload = multer({
  dest: path.join(process.cwd(), 'uploads'),
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
});

router.post('/register', async (req, res) => {
  const { username, password } = req.body;
  const candidate = await User.findOne({ username });
  if (candidate) return res.status(400).json({ message: 'Пользователь уже существует' });

  const hash = await bcrypt.hash(password, 10);
  const user = new User({ username, password: hash });
  await user.save();
  res.sendStatus(201);
});

router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  const user = await User.findOne({ username });
  if (!user) return res.sendStatus(401);
  const isValid = await bcrypt.compare(password, user.password);
  if (!isValid) return res.sendStatus(403);
  req.session.userId = user._id;
  res.sendStatus(200);
});

router.get('/me', (req, res) => {
  if (!req.session.userId) return res.sendStatus(401);
  res.json({ userId: req.session.userId });
});

router.post('/logout', (req, res) => {
  req.session.destroy(() => {
    res.clearCookie('connect.sid');
    res.sendStatus(200);
  });
});

// Получить профиль текущего пользователя
router.get('/profile', async (req, res) => {
  if (!req.session.userId) return res.sendStatus(401);
  const user = await User.findById(req.session.userId).select('-password');
  if (!user) return res.sendStatus(404);
  res.json(user);
});

// Обновить профиль текущего пользователя
router.put('/profile', async (req, res) => {
  if (!req.session.userId) return res.sendStatus(401);
  const { name, avatar, bio, links } = req.body;
  const user = await User.findByIdAndUpdate(
    req.session.userId,
    { name, avatar, bio, links },
    { new: true }
  ).select('-password');
  res.json(user);
});

// Загрузка аватара
router.post('/avatar', upload.single('avatar'), async (req, res) => {
  if (!req.session.userId) return res.sendStatus(401);
  const fileUrl = `/uploads/${req.file.filename}`;
  await User.findByIdAndUpdate(req.session.userId, { avatar: fileUrl });
  res.json({ avatar: fileUrl });
});

// Загрузка cover
router.post('/cover', upload.single('cover'), async (req, res) => {
  if (!req.session.userId) return res.sendStatus(401);
  const fileUrl = `/uploads/${req.file.filename}`;
  await User.findByIdAndUpdate(req.session.userId, { cover: fileUrl });
  res.json({ cover: fileUrl });
});

// Получить пользователя по ID
router.get('/user/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) return res.sendStatus(404);
    res.json(user);
  } catch {
    res.sendStatus(400);
  }
});

// Подписаться на пользователя
router.post('/user/:id/follow', async (req, res) => {
  if (!req.session.userId) return res.sendStatus(401);
  const userId = req.session.userId;
  const targetId = req.params.id;
  if (userId === targetId) return res.status(400).json({ error: "Нельзя подписаться на себя" });

  await User.findByIdAndUpdate(targetId, { $addToSet: { followers: userId } });
  await User.findByIdAndUpdate(userId, { $addToSet: { following: targetId } });
  res.json({ success: true });
});

// Отписаться от пользователя
router.post('/user/:id/unfollow', async (req, res) => {
  if (!req.session.userId) return res.sendStatus(401);
  const userId = req.session.userId;
  const targetId = req.params.id;
  await User.findByIdAndUpdate(targetId, { $pull: { followers: userId } });
  await User.findByIdAndUpdate(userId, { $pull: { following: targetId } });
  res.json({ success: true });
});

// Получить пользователей по массиву ID
router.post('/users-by-ids', async (req, res) => {
  const { ids } = req.body;
  if (!Array.isArray(ids)) return res.json([]);
  const users = await User.find({ _id: { $in: ids } }).select('_id name username avatar');
  res.json(users);
});

export default router;