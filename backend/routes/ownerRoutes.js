import { Router } from 'express'
import {
  createOwner,
  deleteOwner,
  listOwners,
  updateOwner,
} from '../controllers/ownerController.js'

const router = Router()

router.get('/', listOwners)
router.post('/', createOwner)
router.patch('/:id', updateOwner)
router.delete('/:id', deleteOwner)

export default router
