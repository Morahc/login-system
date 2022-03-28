import { Router } from 'express';
import { protect } from '../middleware/protect.js';

const router = Router();

router.get('/',protect, (req, res) => {
  res.send('Hello World!');
});

export default router;
