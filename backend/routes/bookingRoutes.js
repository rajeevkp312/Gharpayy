import { Router } from 'express'
import {
  createBooking,
  deleteBooking,
  listBookings,
  updateBooking,
} from '../controllers/bookingController.js'

const router = Router()

router.get('/', listBookings)
router.post('/', createBooking)
router.patch('/:id', updateBooking)
router.delete('/:id', deleteBooking)

export default router
