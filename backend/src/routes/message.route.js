import { Router } from "express";
import { protechRoute } from "../middleware/auth.middleware.js";
import { getMessages, getUserSidebar, sendMessage } from "../controllers/message.controller.js";

const router = Router()

router.get('/users', protechRoute, getUserSidebar)
router.get('/:id', protechRoute, getMessages)

router.post('/send/:id', protechRoute, sendMessage)
export default router