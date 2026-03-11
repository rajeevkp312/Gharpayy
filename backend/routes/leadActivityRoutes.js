import { Router } from 'express'
import { getLeadActivity } from '../controllers/leadActivityController.js'

const router = Router({ mergeParams: true })

router.get('/', getLeadActivity)

export default router
