import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { connectDB } from './utils/index.js';
import user from './routes/user.js';
import admin from './routes/admin.js';

const app = express();
dotenv.config();
connectDB();

app.use(
  cors({
    origin: 'http://localhost:3000',
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

app.use(express.json());
app.use(cookieParser());

app.use('/api/user', user);
app.use('/api/admin', admin);

app.use((err, req, res, next) => {
  const errorStatus = err.status || 500;
  const errorMessage = err.message || 'Something went wrong!';
  return res.status(errorStatus).json({
    success: false,
    message: errorMessage,
    stack: process.env.NODE_ENV === 'production' ? null : err.stack,
  });
});

app.listen(5000, () => {
  console.log('Server is running on port 5000');
});
