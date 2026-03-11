import { Router } from 'express'
import {
  createBed,
  deleteBed,
  listBedsByProperty,
  updateBed,
  updateBedStatus,
} from '../controllers/bedController.js'

const router = Router({ mergeParams: true })

router.get('/', listBedsByProperty)
router.post('/rooms/:roomId/beds', createBed)
router.patch('/beds/:id', updateBed)
router.patch('/beds/:id/status', updateBedStatus)
router.delete('/beds/:id', deleteBed)

export default router
