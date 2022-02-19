import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import cors from 'cors';
const PORT = 4000 || process.env.PORT;
const app = express();

//route import
import postRoutes from './routes/posts.js';

app.use(bodyParser.json({ limit: '50mb', extended: true }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
app.use(cors());
app.use('/posts', postRoutes);

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
