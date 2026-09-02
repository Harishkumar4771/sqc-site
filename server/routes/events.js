import { Router } from 'express'
import db from '../db.js'

const router = Router()

/* GET /api/events — Returns all events */
router.get('/', (req, res) => {
  try {
    const { category, status } = req.query
    let query = 'SELECT * FROM events'
    const conditions = []
    const params = []

    if (category && category !== 'All') {
      conditions.push('category = ?')
      params.push(category)
    }
    if (status) {
      conditions.push('status = ?')
      params.push(status)
    }

    if (conditions.length > 0) {
      query += ' WHERE ' + conditions.join(' AND ')
    }
    query += ' ORDER BY date DESC'

    const events = db.prepare(query).all(...params)

    // Parse JSON fields
    const parsed = events.map(e => ({
      id: e.id,
      slug: e.slug,
      title: e.title,
      subtitle: e.subtitle,
      category: e.category,
      date: e.date,
      dateDisplay: e.date_display,
      status: e.status,
      location: e.location,
      participants: e.participants,
      duration: e.duration,
      sessions: e.sessions,
      coverImage: e.cover_image,
      excerpt: e.excerpt,
      description: JSON.parse(e.description || '[]'),
      tags: JSON.parse(e.tags || '[]'),
      registrationUrl: e.registration_url,
      ibmBadge: e.ibm_badge,
      qiskitLogo: e.qiskit_logo,
      gallery: JSON.parse(e.gallery || '[]'),
    }))

    res.json(parsed)
  } catch (err) {
    console.error('Error fetching events:', err)
    res.status(500).json({ error: 'Failed to fetch events' })
  }
})

/* GET /api/events/:id — Returns a single event */
router.get('/:id', (req, res) => {
  try {
    const event = db.prepare('SELECT * FROM events WHERE id = ? OR slug = ?')
      .get(req.params.id, req.params.id)

    if (!event) {
      return res.status(404).json({ error: 'Event not found' })
    }

    const parsed = {
      id: event.id,
      slug: event.slug,
      title: event.title,
      subtitle: event.subtitle,
      category: event.category,
      date: event.date,
      dateDisplay: event.date_display,
      status: event.status,
      location: event.location,
      participants: event.participants,
      duration: event.duration,
      sessions: event.sessions,
      coverImage: event.cover_image,
      excerpt: event.excerpt,
      description: JSON.parse(event.description || '[]'),
      tags: JSON.parse(event.tags || '[]'),
      registrationUrl: event.registration_url,
      ibmBadge: event.ibm_badge,
      qiskitLogo: event.qiskit_logo,
      gallery: JSON.parse(event.gallery || '[]'),
    }

    // Get registration count for this event
    const regCount = db.prepare('SELECT COUNT(*) as count FROM event_registrations WHERE event_id = ?')
      .get(event.id)
    parsed.registrationCount = regCount.count

    res.json(parsed)
  } catch (err) {
    console.error('Error fetching event:', err)
    res.status(500).json({ error: 'Failed to fetch event' })
  }
})

export default router
