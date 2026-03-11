import { Router } from 'express'
import { getPipeline } from '../controllers/pipelineController.js'

const router = Router()

router.get('/', getPipeline)

export default router
