import mongoose from 'mongoose';
import PostMessage from '../models/postMessage.js';

export const getPosts = async (req, res) => {
  try {
    const postmessages = await PostMessage.find();
    // console.log(postmessages);
    res.status(200).json(postmessages);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};

export const createPost = async (req, res) => {
  const post = req.body;
  const newPost = new PostMessage(post);
  try {
    await newPost.save();
    res.status(201).json(newPost);
  } catch (err) {
    res.status(409).json({ message: err.message });
  }
};

export const updatePost = async (req, res) => {
  const { id: _id } = req.params;
  const post = req.body;
  if (!mongoose.Types.ObjectId.isValid(_id))
    res.status(404).send(`No post with given id exits in db`);

  const updatedpost = await PostMessage.findByIdAndUpdate(
    _id,
    { _id, ...post },
    {
      new: true,
    }
  );

  res.json(updatedpost);
};

export const deletePost = async (req, res) => {
  const { id: _id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(_id))
    res.status(404).send(`No post with given id exits in db`);

  const updatedpost = await PostMessage.findByIdAndRemove(_id);

  res.json({ message: 'post deleted succesfully' });
};

export const likePost = async (req, res) => {
  const { id: _id } = req.params;

  if (!req.userId) {
    res.json({ message: 'Unauthenticated' });
  }

  if (!mongoose.Types.ObjectId.isValid(_id))
    res.status(404).send(`No post with given id exits in db`);

  const post = await PostMessage.findById(_id);

  const index = post.likes.findIndex((id) => id === req.userId);

  if (index != -1) {
    res.json({ message: 'already liked' });
  } else {
    post.likes.push(req.userId);
  }

  const updatedPost = await PostMessage.findByIdAndUpdate(_id, post, {
    new: true,
  });

  res.json(updatedPost);
};
