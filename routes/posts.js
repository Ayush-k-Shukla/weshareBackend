import express from 'express';
import multer from 'multer';
import {
  commentPost,
  createPost,
  deletePost,
  getPost,
  getPosts,
  getPostsBySearch,
  likePost,
  updatePost,
  uploadFile,
} from '../controllers/posts.js';
import auth from '../middleware/auth.js';
const router = express.Router();
const multerSingle = multer();

//auth middleware handles all the changes of the our single user
router.get('/search', getPostsBySearch);
router.get('/', getPosts);
router.post('/upload', multerSingle.single('file'), uploadFile);
router.get('/:id', getPost);

router.post('/', auth, createPost);
router.patch('/:id', auth, updatePost);
router.patch('/:id/likePost', auth, likePost);
router.post('/:id/commentPost', auth, commentPost);
router.delete('/:id', auth, deletePost);
export default router;
