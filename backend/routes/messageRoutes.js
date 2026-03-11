import { Router } from 'express'
import {
  createOrGetThread,
  listMessages,
  listThreads,
  sendMessage,
} from '../controllers/messageController.js'

const router = Router()

router.get('/threads', listThreads)
router.post('/threads', createOrGetThread)
router.get('/threads/:id/messages', listMessages)
router.post('/threads/:id/messages', sendMessage)

export default router
