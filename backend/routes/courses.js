import express from 'express';
import multer from 'multer';
import path from 'path';
import Course from '../models/Course.js';
import User from '../models/User.js';

const router = express.Router();

// Настройка Multer для загрузки видео и постеров
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    if (file.fieldname === 'video') cb(null, 'uploads/videos');
    else if (file.fieldname === 'poster') cb(null, 'uploads/posters');
    else cb(null, 'uploads');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  }
});
const upload = multer({ storage });

// Загрузка курса (видео)
router.post('/upload', upload.fields([
  { name: 'video', maxCount: 1 },
  { name: 'poster', maxCount: 1 }
]), async (req, res) => {
  const { title, description, isPrivate, allowedSubscriptions } = req.body;
  let posterUrl = null;
  if (req.files && req.files.poster && req.files.poster.length > 0) {
    posterUrl = `/uploads/posters/${req.files.poster[0].filename}`;
  }

  const course = new Course({
    title,
    description,
    posterUrl,
    author: req.session.userId,
    isPrivate: isPrivate === 'true',
    allowedSubscriptions: allowedSubscriptions ? allowedSubscriptions.split(',') : [],
    videos: [] // новый курс без видео
  });
  await course.save();
  res.json(course);
});

// Загрузка видео в существующий курс
router.post('/upload-video', upload.fields([
  { name: 'video', maxCount: 1 },
  { name: 'poster', maxCount: 1 }
]), async (req, res) => {
  if (!req.session.userId) return res.sendStatus(401);
  const { title, description, courseId } = req.body;
  const videoUrl = `/uploads/videos/${req.files.video[0].filename}`;
  const posterUrl = req.files.poster && req.files.poster.length > 0 ? `/uploads/posters/${req.files.poster[0].filename}` : null;

  const course = await Course.findById(courseId);
  if (!course) return res.sendStatus(404);

  course.videos = course.videos || [];
  course.videos.push({
    title,
    description,
    url: videoUrl,
    poster: posterUrl,
    uploadedAt: new Date()
  });

  await course.save();
  res.json({ success: true, course });
});

// Получить курсы, на которые подписан пользователь
router.get('/subscriptions', async (req, res) => {
  if (!req.session.userId) return res.sendStatus(401);
  const user = await User.findById(req.session.userId);
  if (!user || !Array.isArray(user.subscribedCourses) || user.subscribedCourses.length === 0) {
    return res.json([]);
  }
  // Оставляем только валидные ObjectId
  const validIds = user.subscribedCourses.filter(id => id && id.toString().length === 24);
  if (validIds.length === 0) return res.json([]);
  const courses = await Course.find({ _id: { $in: validIds } }).populate('author', 'name username');
  res.json(courses);
});

// Получить курсы с фильтрацией по автору, подписке или рекомендации
router.get('/', async (req, res, next) => {
  try {
    if (req.query.author) {
      let authorId = req.query.author;
      if (authorId === "me") {
        if (!req.session.userId) return res.sendStatus(401);
        authorId = req.session.userId;
      }
      const courses = await Course.find({ author: authorId });
      return res.json(courses);
    }
    // Курсы, на которые подписан (по подписке)
    if (req.query.subscribed && req.session.subscription && req.session.subscription !== "free") {
      const courses = await Course.find({
        isPrivate: true,
        allowedSubscriptions: req.session.subscription
      });
      return res.json(courses);
    }
    // Рекомендации (например, публичные курсы)
    if (req.query.recommended) {
      const courses = await Course.find({ isPrivate: false }).limit(10);
      return res.json(courses);
    }
    // Все публичные и доступные по подписке
    const userSub = req.session.subscription || "free";
    const courses = await Course.find({
      $or: [
        { isPrivate: false },
        { allowedSubscriptions: userSub }
      ]
    });
    res.json(courses);
  } catch (err) {
    next(err);
  }
});

// Получить видео курса с проверкой доступа
router.get('/:id', async (req, res) => {
  const course = await Course.findById(req.params.id);
  if (!course) return res.sendStatus(404);
  if (course.isPrivate) {
    const userSub = req.session.subscription || "free";
    if (!course.allowedSubscriptions.includes(userSub)) {
      return res.status(403).json({ message: "Нет доступа" });
    }
  }
  res.json(course);
});

// Удаление видео из курса по индексу
router.delete('/:courseId/video/:videoIdx', async (req, res) => {
  if (!req.session.userId) return res.sendStatus(401);
  const { courseId, videoIdx } = req.params;

  const course = await Course.findById(courseId);
  if (!course) return res.sendStatus(404);

  // (опционально) Только автор курса может удалять видео
  if (String(course.author) !== String(req.session.userId)) return res.sendStatus(403);

  if (!course.videos || course.videos.length <= videoIdx) return res.sendStatus(404);

  course.videos.splice(videoIdx, 1);
  await course.save();

  res.json({ success: true, course });
});

// Подписка на курс
router.post('/:courseId/subscribe', async (req, res) => {
  if (!req.session.userId) return res.sendStatus(401);
  const user = await User.findById(req.session.userId);
  if (!user) return res.sendStatus(404);
  // Корректное сравнение id
  if (!user.subscribedCourses.map(id => id.toString()).includes(req.params.courseId)) {
    user.subscribedCourses.push(req.params.courseId);
    await user.save();
  }
  res.json({ success: true });
});

// Отписка от курса
router.post('/:courseId/unsubscribe', async (req, res) => {
  if (!req.session.userId) return res.sendStatus(401);
  const user = await User.findById(req.session.userId);
  if (!user) return res.sendStatus(404);
  user.subscribedCourses = user.subscribedCourses.filter(
    id => id.toString() !== req.params.courseId.toString()
  );
  await user.save();
  res.json({ success: true });
});

export default router;