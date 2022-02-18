import mongoose from 'mongoose';
import PostMessage from '../models/postMessage.js';

export const getPosts = async (req, res) => {
  try {
    const postmessages = await PostMessage.find();
    console.log(postmessages);
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

  const updatedpost = await PostMessage.findByIdAndUpdate(_id, post, {
    new: true,
  });

  res.json(updatedpost);
};
