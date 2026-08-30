import { Router } from 'express'
import db from '../db.js'

const router = Router()

/* POST /api/newsletter — Subscribe to newsletter */
router.post('/', (req, res) => {
  try {
    const { email, name } = req.body

    if (!email) {
      return res.status(400).json({ error: 'Email is required' })
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: 'Invalid email address' })
    }

    // Check if already subscribed
    const existing = db.prepare('SELECT id, subscribed FROM newsletter_subscribers WHERE email = ?').get(email)

    if (existing) {
      if (existing.subscribed) {
        return res.status(409).json({ error: 'You are already subscribed!' })
      }
      // Re-subscribe
      db.prepare('UPDATE newsletter_subscribers SET subscribed = 1, name = COALESCE(?, name) WHERE email = ?')
        .run(name || null, email)
      return res.json({ success: true, message: 'Welcome back! You have been re-subscribed.' })
    }

    db.prepare('INSERT INTO newsletter_subscribers (email, name) VALUES (?, ?)')
      .run(email, name || null)

    res.status(201).json({
      success: true,
      message: 'Successfully subscribed to the SQC newsletter!',
    })
  } catch (err) {
    console.error('Error subscribing:', err)
    res.status(500).json({ error: 'Subscription failed. Please try again.' })
  }
})

/* DELETE /api/newsletter — Unsubscribe */
router.delete('/', (req, res) => {
  try {
    const { email } = req.body
    if (!email) {
      return res.status(400).json({ error: 'Email is required' })
    }

    db.prepare('UPDATE newsletter_subscribers SET subscribed = 0 WHERE email = ?').run(email)
    res.json({ success: true, message: 'You have been unsubscribed.' })
  } catch (err) {
    res.status(500).json({ error: 'Failed to unsubscribe' })
  }
})

/* GET /api/newsletter — List subscribers (admin use) */
router.get('/', (req, res) => {
  try {
    const subscribers = db.prepare(`
      SELECT id, email, name, created_at AS subscribedAt
      FROM newsletter_subscribers
      WHERE subscribed = 1
      ORDER BY created_at DESC
    `).all()

    res.json({
      count: subscribers.length,
      subscribers,
    })
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch subscribers' })
  }
})

export default router
