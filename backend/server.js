import express from 'express';
import dotenv from 'dotenv';
import session from 'express-session';
import MongoDbStore from 'connect-mongodb-session';
import cors from 'cors';
import connectDB from './utils/connectDb.js';
import user from './routes/user.js';

const app = express();
const store = MongoDbStore(session);

dotenv.config();
connectDB();

app.use(
  cors({
    origin: 'http://localhost:3000',
    credentials: true,
  })
);
app.use(express.json());
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: new store({
      uri: process.env.MONGO_URI,
      collection: 'sessions',
    }),
    cookie: {
      maxAge: 360000,
      httpOnly: true,
    },
  })
);

app.use('/user', user);

app.get('/protected', (req, res) => {
  if (req.session.user) {
    res.send('Welcome to the protected route, ' + req.sessionID);
  } else {
    res.send('You are not logged in');
  }
});

app.listen(5000, () => {
  console.log('Server is running on port 5000');
});
