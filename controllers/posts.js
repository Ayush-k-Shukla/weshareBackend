import cloudinary from 'cloudinary';
import express from 'express';
import mongoose from 'mongoose';
import { Readable } from 'stream';
import PostMessage from '../models/postMessage.js';

const router = express.Router();

/**
 * fetch the post data by id
 * @return {data}
 */

export const getPost = async (req, res) => {
  const { id } = req.params;

  try {
    const post = await PostMessage.findById(id);
    res.status(200).json({ data: post });
  } catch (error) {
    console.log(error);
  }
};

export const getPosts = async (req, res) => {
  const { page } = req.query;

  try {
    const limit = 9;
    const startIndex = (Number(page) - 1) * limit;
    const total = await PostMessage.countDocuments({});

    const posts = await PostMessage.find()
      .sort({ _id: -1 })
      .limit(limit)
      .skip(startIndex);

    res.status(200).json({
      data: posts,
      currentPage: Number(page),
      numberOfPages: Math.ceil(total / limit),
    });
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};

export const getPostsBySearch = async (req, res) => {
  const { searchQuery, tags } = req.query;

  try {
    const title = new RegExp(searchQuery, 'i');
    const posts = await PostMessage.find({
      $or: [{ title }, { tags: { $in: tags.split(',') } }],
    });

    res.json({ data: posts });
  } catch (error) {
    res.status(404).json({ message: err });
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

  if (!req.userId) {
    res.json({ message: 'Unauthenticated' });
  }

  if (!mongoose.Types.ObjectId.isValid(id))
    res.status(404).send(`No post with given id exits in db`);

  const post = await PostMessage.findById(id);

  const index = post.likes.findIndex((id) => id === String(req.userId));

  if (index != -1) {
    post.likes = post.likes.filter((id) => id !== String(req.userId));

  } else {
    post.likes.push(req.userId);
  }

  const updatedPost = await PostMessage.findByIdAndUpdate(id, post, {
    new: true,
  });

  res.status(200).json(updatedPost);
};

export const commentPost = async (req, res) => {
  const { id } = req.params;
  const { finalComment } = req.body;

  if (!mongoose.Types.ObjectId.isValid(id))
    res.status(404).send(`No post with given id exits in db`);

  const post = await PostMessage.findById(id);
  post.comments?.push(finalComment);

  const updatedPost = await PostMessage.findByIdAndUpdate(id, post, {
    new: true,
  });

  res.status(200).json(updatedPost);
};

/**
 * Upload our file to cloudinary
 * @param {buffer} buffer - file buffer
 * @return {Promise}
 */
const bufferUpload = async (buffer) => {
  return new Promise(async (resolve, reject) => {
    const writeStream = await cloudinary.uploader.upload_stream(
      (result, err) => {
        if (err) {
          console.log(err);
          reject(err);
          return;
        }
        resolve(result);
      }
    );

    const readStream = new Readable({
      read() {
        this.push(buffer);
        this.push(null);
      },
    });

    readStream.pipe(writeStream);
  });
};

export const uploadFile = async (req, res) => {
  const { buffer } = req.file;
  try {
    const { secure_url } = await bufferUpload(buffer);

    res.json({ data: secure_url });
  } catch (error) {
    console.log(error);
    res.send('Something went wrong please try again later..');
  }
};

export default router;
