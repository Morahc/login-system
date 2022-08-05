import { Router } from 'express';
import { deleteUser, editUserInfo, getUsers, getUser } from '../controllers/admin.js';
import { admin, protect } from '../middleware/protect.js';

const router = Router();

router.get('/users', protect, admin, getUsers);

router.get('/users/:id', protect, admin, getUser);

router.patch('/edit/:id', protect, admin, editUserInfo);

router.delete('/delete/:id', protect, admin, deleteUser);

export default router;
