import { Router } from 'express'
import {
  createRoom,
  deleteRoom,
  listRoomsByProperty,
  updateRoom,
} from '../controllers/roomController.js'

const router = Router({ mergeParams: true })

router.get('/', listRoomsByProperty)
router.post('/', createRoom)
router.patch('/:id', updateRoom)
router.delete('/:id', deleteRoom)

export default router
