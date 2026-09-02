import { Router } from 'express'
import db from '../db.js'

const router = Router()

/* GET /api/team — Returns all team members grouped by category */
router.get('/', (req, res) => {
  try {
    const members = db.prepare('SELECT * FROM team_members ORDER BY sort_order ASC').all()

    // Group by category to match the frontend's expected structure
    const grouped = {
      faculty: [],
      core: [],
      advisors: [],
      heads: [],
      coheads: [],
    }

    for (const m of members) {
      const member = {
        name: m.name,
        role: m.role,
        department: m.department,
        bio: m.bio,
        image: m.image,
        linkedin: m.linkedin,
        ...(m.rotated ? { rotated: true } : {}),
      }
      if (grouped[m.category]) {
        grouped[m.category].push(member)
      }
    }

    res.json(grouped)
  } catch (err) {
    console.error('Error fetching team:', err)
    res.status(500).json({ error: 'Failed to fetch team data' })
  }
})

export default router
