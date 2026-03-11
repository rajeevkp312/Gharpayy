import { Router } from 'express'
import { createLead, getLeads, updateLeadStatus } from '../controllers/leadController.js'
import leadActivityRoutes from './leadActivityRoutes.js'

const router = Router()

router.post('/', createLead)
router.get('/', getLeads)
router.patch('/:id', updateLeadStatus)

router.use('/:id/activity', leadActivityRoutes)

export default router
