import mongoose from 'mongoose';
import PostMessage from '../models/postMessage.js';
import express from 'express';

const router = express.Router();

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
  const newPost = new PostMessage({
    ...post,
    creator: req.userId,
    createdAt: new Date().toISOString(),
  });
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
  const { id } = req.params;

  console.log(req.userId);

  if (!req.userId) {
    res.json({ message: 'Unauthenticated' });
  }

  if (!mongoose.Types.ObjectId.isValid(id))
    res.status(404).send(`No post with given id exits in db`);

  const post = await PostMessage.findById(id);

  const index = post.likes.findIndex((id) => id === String(req.userId));

  if (index != -1) {
    post.likes = post.likes.filter((id) => id !== String(req.userId));
    console.log(`firs liked`);
  } else {
    post.likes.push(req.userId);
  }
  console.log(JSON.stringify(post.likes));

  const updatedPost = await PostMessage.findByIdAndUpdate(id, post, {
    new: true,
  });

  res.status(200).json(updatedPost);
};

export default router;
