import { Router } from 'express'
import { createPublicLead } from '../controllers/publicLeadController.js'
import {
  receiveCalendlyWebhook,
  receiveGoogleFormsWebhook,
  receiveTallyWebhook,
  receiveWebhookGeneric,
} from '../controllers/webhookController.js'

const router = Router()

router.post('/lead', createPublicLead)

// "Real-ish" integrations (webhook receivers)
router.post('/webhooks/tally', receiveTallyWebhook)
router.post('/webhooks/calendly', receiveCalendlyWebhook)
router.post('/webhooks/google-forms', receiveGoogleFormsWebhook)
router.post('/webhooks/:provider', receiveWebhookGeneric)

export default router
