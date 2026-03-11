import { Router } from 'express'
import { getAgents, getAgentPerformance } from '../controllers/agentController.js'

const router = Router()

router.get('/', getAgents)
router.get('/performance', getAgentPerformance)

export default router
