import {Router} from 'express';
import { signin, signup, logout, checkAuth, updateProfile } from '../controllers/auth.controller.js';
import { protechRoute } from '../middleware/auth.middleware.js';
const router = Router()

router.post('/signup', signup)
router.post('/signin', signin)
router.post('/logout', logout)

router.put('/update-profile', protechRoute, updateProfile)

router.get('/check', protechRoute, checkAuth)
export default router;