import express from 'express';
import Post from '../../models/postModel.js';
import User from '../../models/UserModel.js';
const router = express.Router();

router.get('/', async (req, res, next) => {
  //   try {
  //     const posts = await Post.find({})
  //       .populate('postedBy')
  //       .populate('retweetData')
  //       .sort({ createdAt: -1 });

  //     let result = await User.populate(posts, { path: 'retweetData.postedBy' });
  //     return res.status(200).send(result);
  //   } catch (error) {
  //     console.error(error);
  //     return res.sendStatus(400);
  //   }
  const results = await getPosts({});
  res.status(200).send(results);
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

router.put('/:id/like', async (req, res, next) => {
  const { id } = req.params;
  const user = req.session.user;
  let isLiked = user.likes && user.likes.includes(id);

  let option = isLiked ? '$pull' : '$addToSet';
  // Insert user like
  const updatedUser = await User.findByIdAndUpdate(
    user._id,
    {
      [option]: { likes: id },
    },
    { new: true },
  );
  req.session.user = updatedUser;
  //Insert post like
  const updatedPost = await Post.findByIdAndUpdate(
    id,
    {
      [option]: { likes: user._id },
    },
    { new: true },
  );

  res.status(200).send(updatedPost);
});

router.post('/:id/retweet', async (req, res, next) => {
  const { id } = req.params;
  const user = req.session.user;

  //Try to delete it
  let deletedPost = await Post.findOneAndDelete({
    postedBy: user._id,
    retweetData: id,
  });

  let option = deletedPost ? '$pull' : '$addToSet';

  let repost = deletedPost;

  if (repost == null) {
    repost = await Post.create({ postedBy: user._id, retweetData: id });
  }
  // Insert user like
  const updatedUser = await User.findByIdAndUpdate(
    user._id,
    {
      [option]: { retweets: repost._id },
    },
    { new: true },
  );
  req.session.user = updatedUser;
  //Insert post like
  const updatedPost = await Post.findByIdAndUpdate(
    id,
    {
      [option]: { retweetUsers: user._id },
    },
    { new: true },
  );

  res.status(200).send(updatedPost);
});

router.get('/:id', async (req, res, next) => {
  let postId = req.params.id;
  const results = await getPosts({ _id: postId });
  res.status(200).send(results[0]);
});

async function getPosts(filter) {
  const results = await Post.find(filter)
    .populate('postedBy')
    .populate('retweetData')
    .sort({ createdAt: -1 })
    .catch((error) => console.log(error));
  return await User.populate(results, { path: 'retweetData.postedBy' });
}
export default router;
