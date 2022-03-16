import mongoose from 'mongoose';

const postSchema = new mongoose.Schema({
  title: { type: String },
  message: { type: String },
  creator: { type: String },
  name: { type: String },
  tags: { type: [String] },
  selectedFile: { type: String },
  likes: { type: [String], default: [] },
  createdAt: {
    type: Date,
    default: new Date(),
  },
  comments: { type: [String], default: [] },
});

const PostMessage = mongoose.model('PostMessage', postSchema);
export default PostMessage;
