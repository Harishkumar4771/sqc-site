import { Router } from 'express'
import db from '../db.js'

const router = Router()

/* POST /api/contact — Submit a contact form */
router.post('/', (req, res) => {
  try {
    const { name, email, subject, message } = req.body

    // Validation
    if (!name || !email || !message) {
      return res.status(400).json({ error: 'name, email, and message are required' })
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: 'Invalid email address' })
    }

    // Rate limiting: max 3 submissions from same email in 1 hour
    const recentCount = db.prepare(`
      SELECT COUNT(*) as count FROM contact_submissions
      WHERE email = ? AND created_at > datetime('now', '-1 hour')
    `).get(email)

    if (recentCount.count >= 3) {
      return res.status(429).json({ error: 'Too many submissions. Please try again later.' })
    }

    db.prepare(`
      INSERT INTO contact_submissions (name, email, subject, message)
      VALUES (?, ?, ?, ?)
    `).run(name, email, subject || null, message)

    res.status(201).json({
      success: true,
      message: 'Message received! We\'ll get back to you soon.',
    })
  } catch (err) {
    console.error('Error saving contact:', err)
    res.status(500).json({ error: 'Failed to submit message. Please try again.' })
  }
})

/* GET /api/contact — List submissions (admin use) */
router.get('/', (req, res) => {
  try {
    const submissions = db.prepare(`
      SELECT id, name, email, subject, message, read, created_at AS createdAt
      FROM contact_submissions
      ORDER BY created_at DESC
    `).all()

    res.json({
      count: submissions.length,
      unread: submissions.filter(s => !s.read).length,
      submissions,
    })
  } catch (err) {
    console.error('Error fetching contacts:', err)
    res.status(500).json({ error: 'Failed to fetch contacts' })
  }
})

/* PATCH /api/contact/:id/read — Mark a submission as read */
router.patch('/:id/read', (req, res) => {
  try {
    db.prepare('UPDATE contact_submissions SET read = 1 WHERE id = ?').run(req.params.id)
    res.json({ success: true })
  } catch (err) {
    res.status(500).json({ error: 'Failed to update' })
  }
})

export default router
