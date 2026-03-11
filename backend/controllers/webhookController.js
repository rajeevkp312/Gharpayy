import crypto from 'crypto'
import { Lead } from '../models/Lead.js'
import { Agent } from '../models/Agent.js'
import { assignAgent } from '../services/assignmentService.js'
import { logLeadActivity } from '../services/activityService.js'

function normalizePhone(raw) {
  if (!raw) return ''
  const s = String(raw).trim()
  const digits = s.replace(/[^0-9+]/g, '')
  return digits
}

function pickFirst(arr) {
  if (!Array.isArray(arr)) return undefined
  return arr.find((x) => x !== undefined && x !== null && String(x).trim() !== '')
}

function extractFromKeyVariants(obj, variants) {
  if (!obj || typeof obj !== 'object') return undefined
  for (const key of variants) {
    if (obj[key] !== undefined && obj[key] !== null && String(obj[key]).trim() !== '') return obj[key]
  }
  return undefined
}

function verifySharedSecret(req) {
  const secret = process.env.WEBHOOK_SHARED_SECRET
  if (!secret) return { ok: true }

  const provided = req.header('x-gharpayy-webhook-secret')
  if (!provided || provided !== secret) {
    return { ok: false, message: 'Invalid webhook secret' }
  }
  return { ok: true }
}

function safeJsonStringify(x) {
  try {
    return JSON.stringify(x)
  } catch {
    return String(x)
  }
}

async function createLeadFromIntegration({ name, phone, source, rawPayload, integration }) {
  const assignedAgent = await assignAgent()

  const lead = await Lead.create({
    name: name || 'Unknown',
    phone,
    source,
    status: 'New Lead',
    assignedAgent: assignedAgent?._id ?? null,
    integration: integration || source,
    rawPayload,
  })

  await logLeadActivity({
    leadId: lead._id,
    agentId: assignedAgent?._id ?? null,
    activityType: 'Lead Created',
    description: `Lead captured via webhook: ${source}`,
  })

  if (assignedAgent) {
    await logLeadActivity({
      leadId: lead._id,
      agentId: assignedAgent._id,
      activityType: 'Agent Assigned',
      description: `Assigned to ${assignedAgent.name}`,
    })

    await Agent.updateOne({ _id: assignedAgent._id }, { $inc: { activeLeads: 1 } })
  }

  return lead
}

export async function receiveTallyWebhook(req, res) {
  const v = verifySharedSecret(req)
  if (!v.ok) return res.status(401).json({ message: v.message })

  try {
    // Tally payload varies; support:
    // - req.body.data.fields (array of { key, label, value })
    // - req.body.fields (array)
    const fields = req.body?.data?.fields || req.body?.fields || []
    const fieldMap = {}
    if (Array.isArray(fields)) {
      for (const f of fields) {
        const k = f?.key || f?.label
        if (!k) continue
        fieldMap[String(k).toLowerCase()] = f?.value
      }
    }

    const name = pickFirst([
      fieldMap['name'],
      fieldMap['full name'],
      fieldMap['fullname'],
      req.body?.data?.name,
    ])

    const phone = normalizePhone(
      pickFirst([
        fieldMap['phone'],
        fieldMap['phone number'],
        fieldMap['mobile'],
        fieldMap['whatsapp'],
        req.body?.data?.phone,
      ]),
    )

    if (!phone) return res.status(400).json({ message: 'Unable to extract phone from Tally payload' })

    const source = 'Tally'
    const lead = await createLeadFromIntegration({
      name,
      phone,
      source,
      integration: 'tally',
      rawPayload: req.body,
    })

    return res.status(201).json({ ok: true, leadId: lead._id })
  } catch (err) {
    return res.status(500).json({ message: err.message })
  }
}

export async function receiveCalendlyWebhook(req, res) {
  const v = verifySharedSecret(req)
  if (!v.ok) return res.status(401).json({ message: v.message })

  try {
    // Calendly style example:
    // req.body.payload.invitee.{name,email}
    // req.body.payload.questions_and_answers: [{question,answer}]
    const payload = req.body?.payload || req.body
    const invitee = payload?.invitee || payload?.payload?.invitee || payload?.invitee

    const qa = payload?.questions_and_answers || payload?.questions_and_answers || []
    const qaMap = {}
    if (Array.isArray(qa)) {
      for (const item of qa) {
        const q = String(item?.question || '').toLowerCase()
        const a = item?.answer
        if (q) qaMap[q] = a
      }
    }

    const name = pickFirst([invitee?.name, extractFromKeyVariants(payload, ['name', 'fullName', 'full_name'])])
    const phone = normalizePhone(
      pickFirst([
        qaMap['phone'],
        qaMap['phone number'],
        qaMap['mobile'],
        qaMap['whatsapp'],
        payload?.phone,
      ]),
    )

    if (!phone) return res.status(400).json({ message: 'Unable to extract phone from Calendly payload' })

    const source = 'Calendly'
    const lead = await createLeadFromIntegration({
      name,
      phone,
      source,
      integration: 'calendly',
      rawPayload: req.body,
    })

    return res.status(201).json({ ok: true, leadId: lead._id })
  } catch (err) {
    return res.status(500).json({ message: err.message })
  }
}

export async function receiveGoogleFormsWebhook(req, res) {
  const v = verifySharedSecret(req)
  if (!v.ok) return res.status(401).json({ message: v.message })

  try {
    // Google Forms usually needs Apps Script -> webhook
    // Expect a flat payload: { name, phone, source?, ... }
    const body = req.body || {}
    const name = extractFromKeyVariants(body, ['name', 'fullName', 'full_name', 'student_name'])
    const phone = normalizePhone(extractFromKeyVariants(body, ['phone', 'phoneNumber', 'mobile', 'whatsapp']))

    if (!phone) return res.status(400).json({ message: 'Unable to extract phone from Google Forms payload' })

    const source = body.source || 'Google Forms'
    const lead = await createLeadFromIntegration({
      name,
      phone,
      source,
      integration: 'google_forms',
      rawPayload: body,
    })

    return res.status(201).json({ ok: true, leadId: lead._id })
  } catch (err) {
    return res.status(500).json({ message: err.message })
  }
}

export async function receiveWebhookGeneric(req, res) {
  const v = verifySharedSecret(req)
  if (!v.ok) return res.status(401).json({ message: v.message })

  try {
    const provider = String(req.params.provider || 'unknown')
    const body = req.body || {}

    const name = extractFromKeyVariants(body, ['name', 'fullName', 'full_name'])
    const phone = normalizePhone(extractFromKeyVariants(body, ['phone', 'phoneNumber', 'mobile', 'whatsapp']))
    const source = body.source || provider

    if (!phone) return res.status(400).json({ message: 'phone is required in generic webhook payload' })

    const lead = await createLeadFromIntegration({
      name,
      phone,
      source,
      integration: provider,
      rawPayload: body,
    })

    return res.status(201).json({ ok: true, leadId: lead._id })
  } catch (err) {
    return res.status(500).json({ message: err.message })
  }
}

// Optional: helper endpoint to generate an HMAC for testing
export function debugWebhookSignature(req, res) {
  const secret = process.env.WEBHOOK_SHARED_SECRET || ''
  const payload = safeJsonStringify(req.body || {})
  const sig = crypto.createHmac('sha256', secret).update(payload).digest('hex')
  res.json({ signature: sig })
}
