import { Router } from 'express'
import db from '../db.js'

const router = Router()

/* GET /api/content/testimonials */
router.get('/testimonials', (req, res) => {
  try {
    const data = db.prepare('SELECT id, quote, name, role FROM testimonials').all()
    res.json(data)
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch testimonials' })
  }
})

/* GET /api/content/pioneers */
router.get('/pioneers', (req, res) => {
  try {
    const data = db.prepare('SELECT id, name, role, year, description, image FROM pioneers').all()
    res.json(data)
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch pioneers' })
  }
})

/* GET /api/content/timeline */
router.get('/timeline', (req, res) => {
  try {
    const data = db.prepare('SELECT year, title, description FROM timeline ORDER BY year ASC').all()
    res.json(data)
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch timeline' })
  }
})

/* GET /api/content/stories */
router.get('/stories', (req, res) => {
  try {
    const data = db.prepare('SELECT id, title, description, image FROM stories').all()
    res.json(data)
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch stories' })
  }
})

export default router
