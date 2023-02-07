import cloudinary from 'cloudinary';
import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import mongoose from 'mongoose';
dotenv.config();
const PORT = process.env.PORT || 4000;
const app = express();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_USER_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

//route import
import postRoutes from './routes/posts.js';
import userRoutes from './routes/user.js';

app.use(express.json({ limit: '50mb' }));
app.use(
  express.urlencoded({
    extended: true,
    limit: '50mb',
  })
);

//cors
const corsOptions = {
  //give all name to allowing ports
  credentials: true,
  origin: process.env.POSSIBLE_CLIENT.split(','),
};

app.use(cors(corsOptions));

app.use('/posts', postRoutes);
app.use('/user', userRoutes);

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.get('/', (req, res) => {
  res.send('hello to our vlog app api');
});

const connection = mongoose.createConnection(process.env.MONGO_URI);
connection
  .once('open', () => {
    console.log('db connected.');
  })
  .on('error', (err) => {
    console.error('Error : ' + err);
  });

app.listen(PORT, () => {
  console.log(`server is running at port ${PORT}`);
});
