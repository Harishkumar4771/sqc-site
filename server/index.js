/* ==========================================================================
   SQC BACKEND — Express API Server
   Symbiosis Quantum Club Website
   ========================================================================== */

import express from 'express'
import cors from 'cors'

// Route imports
import teamRoutes from './routes/team.js'
import blogRoutes from './routes/blog.js'
import eventsRoutes from './routes/events.js'
import registerRoutes from './routes/register.js'
import contactRoutes from './routes/contact.js'
import newsletterRoutes from './routes/newsletter.js'
import contentRoutes from './routes/content.js'

const app = express()
const PORT = process.env.PORT || 3001

/* ── Middleware ── */
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:3000', 'http://127.0.0.1:5173'],
  methods: ['GET', 'POST', 'PATCH', 'DELETE'],
  credentials: true,
}))
app.use(express.json({ limit: '1mb' }))

/* ── Request logging (dev) ── */
app.use((req, res, next) => {
  const start = Date.now()
  res.on('finish', () => {
    const duration = Date.now() - start
    const status = res.statusCode
    const color = status >= 400 ? '\x1b[31m' : status >= 300 ? '\x1b[33m' : '\x1b[32m'
    console.log(`${color}${req.method}\x1b[0m ${req.path} → ${status} (${duration}ms)`)
  })
  next()
})

/* ── API Routes ── */
app.use('/api/team', teamRoutes)
app.use('/api/blog', blogRoutes)
app.use('/api/events', eventsRoutes)
app.use('/api/register', registerRoutes)
app.use('/api/contact', contactRoutes)
app.use('/api/newsletter', newsletterRoutes)
app.use('/api/content', contentRoutes)

/* ── Health check ── */
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    name: 'Symbiosis Quantum Club API',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
  })
})

/* ── 404 handler ── */
app.use('/api/:path', (req, res) => {
  res.status(404).json({ error: 'Endpoint not found' })
})

/* ── Start server ── */
app.listen(PORT, () => {
  console.log(`
  ╔══════════════════════════════════════════════════╗
  ║   ⚛️  SQC Backend API Server                     ║
  ║   Running on http://localhost:${PORT}              ║
  ║                                                  ║
  ║   Endpoints:                                     ║
  ║   GET  /api/health          Health check          ║
  ║   GET  /api/team            Team members          ║
  ║   GET  /api/blog            Blog posts            ║
  ║   GET  /api/blog/:id        Blog detail           ║
  ║   GET  /api/events          Events                ║
  ║   GET  /api/events/:id      Event detail          ║
  ║   POST /api/register        Event registration    ║
  ║   POST /api/contact         Contact form          ║
  ║   POST /api/newsletter      Newsletter signup     ║
  ║   GET  /api/content/*       Testimonials, etc.    ║
  ╚══════════════════════════════════════════════════╝
  `)
})
