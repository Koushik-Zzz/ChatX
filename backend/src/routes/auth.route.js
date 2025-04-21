import {Router} from 'express';
import { signin, signup, logout } from '../controllers/auth.controller.js';
import { protechRoute } from '../middleware/auth.middleware.js';
const router = Router()

router.post('/signup', signup)
router.post('/signin', signin)
router.post('/logout', logout)

router.put('/update-profile', protechRoute, updateProfile)
export default router;