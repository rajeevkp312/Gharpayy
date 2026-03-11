import { Router } from 'express'
import { getFollowUps, updateFollowUpStatus } from '../controllers/followUpController.js'

const router = Router()

router.get('/', getFollowUps)
router.patch('/:id', updateFollowUpStatus)

export default router
