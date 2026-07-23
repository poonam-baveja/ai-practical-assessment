import { Router } from 'express';
import { getUsers } from '../controllers/userController';

const router = Router();

// GET /api/users — Fetch all users
router.get('/', getUsers);

export default router;
