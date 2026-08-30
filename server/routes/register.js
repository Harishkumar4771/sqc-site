import { Router } from 'express'
import db from '../db.js'

const router = Router()

/* POST /api/register — Register for an event */
router.post('/', (req, res) => {
  try {
    const { eventId, name, email, phone, college, year, branch, teamName, message } = req.body

    // Validation
    if (!eventId || !name || !email) {
      return res.status(400).json({ error: 'eventId, name, and email are required' })
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: 'Invalid email address' })
    }

    // Check event exists
    const event = db.prepare('SELECT id, title, status FROM events WHERE id = ?').get(eventId)
    if (!event) {
      return res.status(404).json({ error: 'Event not found' })
    }

    // Check for duplicate registration
    const existing = db.prepare('SELECT id FROM event_registrations WHERE event_id = ? AND email = ?')
      .get(eventId, email)
    if (existing) {
      return res.status(409).json({ error: 'You have already registered for this event' })
    }

    // Insert registration
    const result = db.prepare(`
      INSERT INTO event_registrations (event_id, name, email, phone, college, year, branch, team_name, message)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(eventId, name, email, phone || null, college || null, year || null, branch || null, teamName || null, message || null)

    res.status(201).json({
      success: true,
      message: `Successfully registered for ${event.title}!`,
      registrationId: result.lastInsertRowid,
    })
  } catch (err) {
    console.error('Error registering for event:', err)
    res.status(500).json({ error: 'Registration failed. Please try again.' })
  }
})

/* GET /api/register/:eventId — Get registrations for an event (admin use) */
router.get('/:eventId', (req, res) => {
  try {
    const registrations = db.prepare(`
      SELECT id, name, email, phone, college, year, branch, team_name AS teamName, message, created_at AS createdAt
      FROM event_registrations
      WHERE event_id = ?
      ORDER BY created_at DESC
    `).all(req.params.eventId)

    res.json({
      eventId: req.params.eventId,
      count: registrations.length,
      registrations,
    })
  } catch (err) {
    console.error('Error fetching registrations:', err)
    res.status(500).json({ error: 'Failed to fetch registrations' })
  }
})

export default router
