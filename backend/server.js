import express from 'express';
import dotenv from 'dotenv';
import session from 'express-session';
import MongoDbStore from 'connect-mongodb-session';
import connectDB from './utils/connectDb.js';
import user from './routes/user.js';
import item from './routes/item.js';

const app = express();
const store = MongoDbStore(session);

dotenv.config();
connectDB();

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
  })
);

app.use('/user', user);
app.use(item)

app.listen(5000, () => {
  console.log('Server is running on port 5000');
});
