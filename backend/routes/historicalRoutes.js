import { Router } from 'express'
import { exportHistorical, getHistorical } from '../controllers/historicalController.js'

const router = Router()

router.get('/', getHistorical)
router.get('/export', exportHistorical)

export default router
