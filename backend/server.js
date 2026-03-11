import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import path from 'path'
import { fileURLToPath } from 'url'

import { connectDb } from './config/db.js'
import leadRoutes from './routes/leadRoutes.js'
import agentRoutes from './routes/agentRoutes.js'
import visitRoutes from './routes/visitRoutes.js'
import pipelineRoutes from './routes/pipelineRoutes.js'
import followUpRoutes from './routes/followUpRoutes.js'
import dashboardRoutes from './routes/dashboardRoutes.js'
import publicLeadRoutes from './routes/publicLeadRoutes.js'
import messageRoutes from './routes/messageRoutes.js'
import bookingRoutes from './routes/bookingRoutes.js'
import ownerRoutes from './routes/ownerRoutes.js'
import propertyRoutes from './routes/propertyRoutes.js'
import roomRoutes from './routes/roomRoutes.js'
import bedRoutes from './routes/bedRoutes.js'
import effortRoutes from './routes/effortRoutes.js'
import analyticsRoutes from './routes/analyticsRoutes.js'
import historicalRoutes from './routes/historicalRoutes.js'
import { startReminderScheduler } from './services/reminderService.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

dotenv.config({ path: path.resolve(__dirname, '../.env') })

const app = express()

app.use(
  cors({
    origin(origin, cb) {
      const configured = (process.env.CLIENT_ORIGIN || '')
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean)

      if (!origin) return cb(null, true)
      if (configured.length === 0) return cb(null, true)
      if (configured.includes('*')) return cb(null, true)
      if (configured.includes(origin)) return cb(null, true)
      if (/^https:\/\/.*\.vercel\.app$/.test(origin)) return cb(null, true)
      return cb(new Error('Not allowed by CORS'))
    },
  }),
)
app.use(express.json({ limit: '2mb' }))

app.get('/health', (req, res) => {
  res.json({ ok: true })
})

app.use('/api/leads', leadRoutes)
app.use('/api/agents', agentRoutes)
app.use('/api/visits', visitRoutes)
app.use('/api/pipeline', pipelineRoutes)
app.use('/api/followups', followUpRoutes)
app.use('/api/dashboard', dashboardRoutes)
app.use('/api/public', publicLeadRoutes)
app.use('/api/messages', messageRoutes)
app.use('/api/bookings', bookingRoutes)
app.use('/api/owners', ownerRoutes)
app.use('/api/properties', propertyRoutes)
app.use('/api/properties/:propertyId/rooms', roomRoutes)
app.use('/api/properties/:propertyId', bedRoutes)
app.use('/api/efforts', effortRoutes)
app.use('/api/analytics', analyticsRoutes)
app.use('/api/historical', historicalRoutes)

const port = process.env.PORT || 5000

async function start() {
  await connectDb()
  startReminderScheduler()
  app.listen(port, () => {
    // eslint-disable-next-line no-console
    console.log(`Backend listening on port ${port}`)
  })
}

start().catch((err) => {
  // eslint-disable-next-line no-console
  console.error(err)
  process.exit(1)
})
