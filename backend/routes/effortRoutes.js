import { Router } from 'express'
import {
  deleteEffort,
  listEfforts,
  upsertEffort,
} from '../controllers/effortController.js'

const router = Router()

router.get('/', listEfforts)
router.post('/', upsertEffort)
router.delete('/:id', deleteEffort)

export default router
