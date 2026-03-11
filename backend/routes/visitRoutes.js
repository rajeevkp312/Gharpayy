import { Router } from 'express'
import { createVisit, getVisits, updateVisitOutcome } from '../controllers/visitController.js'

const router = Router()

router.post('/', createVisit)
router.get('/', getVisits)
router.patch('/:id', updateVisitOutcome)

export default router
