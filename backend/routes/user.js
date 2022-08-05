import { Router } from 'express';
import { loginUser, logoutUser, profile, registerUser } from '../controllers/user.js';
import { protect } from '../middleware/protect.js';

const router = Router();

router.post('/register', registerUser);

router.post('/login', loginUser);

router.get('/profile', protect, profile);

router.post('/logout', logoutUser);

export default router;
