import express from 'express';
import Post from '../../models/postModel.js';
import User from '../../models/UserModel.js';
const router = express.Router();

router.get('/', async (req, res, next) => {
  try {
    const posts = await Post.find({})
      .populate('postedBy')
      .sort({ createdAt: -1 });
    return res.status(200).send(posts);
  } catch (error) {
    console.error(error);
    return res.sendStatus(400);
  }
});

router.post('/', async (req, res, next) => {
  const { content } = req.body;
  if (!content) {
    console.log('Content param not sent with request');
    return res.sendStatus(400);
  }
  try {
    const newPost = await Post.create({
      content,
      postedBy: req.session.user,
    });
    const newPostAndUser = await User.populate(newPost, { path: 'postedBy' });
    return res.status(201).send(newPostAndUser);
  } catch (error) {
    console.log(error);
    return res.sendStatus(400);
  }
});

export default router;
