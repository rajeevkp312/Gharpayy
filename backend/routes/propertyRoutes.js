import { Router } from 'express'
import {
  createProperty,
  deleteProperty,
  getPropertyDetail,
  listProperties,
  updateProperty,
} from '../controllers/propertyController.js'

const router = Router()

router.get('/', listProperties)
router.post('/', createProperty)
router.get('/:id', getPropertyDetail)
router.patch('/:id', updateProperty)
router.delete('/:id', deleteProperty)

export default router
