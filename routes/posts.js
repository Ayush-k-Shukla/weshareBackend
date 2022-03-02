import express from 'express';
import {
  getPosts,
  createPost,
  updatePost,
  deletePost,
  likePost,
  getPostsBySearch,
  getPost
} from '../controllers/posts.js';
const router = express.Router();
import auth from '../middleware/auth.js';

//auth middleware handles all the changes of the our single user
router.get('/', getPosts);
router.get('/:id', getPost);
router.get('/search', getPostsBySearch);
router.post('/', auth, createPost);
router.patch('/:id', auth, updatePost);
router.patch('/:id/likePost', auth, likePost);
router.delete('/:id', auth, deletePost);
export default router;
