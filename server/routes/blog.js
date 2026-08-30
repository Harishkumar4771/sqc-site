import { Router } from 'express'
import db from '../db.js'

const router = Router()

/* GET /api/blog — Returns all blog posts (list view) */
router.get('/', (req, res) => {
  try {
    const posts = db.prepare(`
      SELECT id, slug, title, date, category, read_time AS readTime,
             excerpt, image, author_name AS author, author_role AS authorRole
      FROM blog_posts
      ORDER BY date DESC
    `).all()

    res.json(posts)
  } catch (err) {
    console.error('Error fetching blog posts:', err)
    res.status(500).json({ error: 'Failed to fetch blog posts' })
  }
})

/* GET /api/blog/:id — Returns a single full blog post with sections and takeaways */
router.get('/:id', (req, res) => {
  try {
    const post = db.prepare(`
      SELECT id, slug, title, date, category, read_time AS readTime,
             excerpt, lead_summary AS leadSummary, image, image_caption AS imageCaption,
             author_name, author_role, author_dept, author_avatar, author_linkedin, tags
      FROM blog_posts
      WHERE id = ? OR slug = ?
    `).get(req.params.id, req.params.id)

    if (!post) {
      return res.status(404).json({ error: 'Blog post not found' })
    }

    // Restructure author
    post.author = {
      name: post.author_name,
      role: post.author_role,
      department: post.author_dept,
      avatar: post.author_avatar,
      linkedin: post.author_linkedin,
    }
    delete post.author_name
    delete post.author_role
    delete post.author_dept
    delete post.author_avatar
    delete post.author_linkedin

    // Parse tags
    post.tags = JSON.parse(post.tags || '[]')

    // Fetch sections
    post.sections = db.prepare(`
      SELECT title, content, quote, code_snippet AS codeSnippet
      FROM blog_sections
      WHERE post_id = ?
      ORDER BY sort_order ASC
    `).all(post.id)

    // Fetch takeaways
    post.takeaways = db.prepare(`
      SELECT takeaway
      FROM blog_takeaways
      WHERE post_id = ?
      ORDER BY sort_order ASC
    `).all(post.id).map(t => t.takeaway)

    res.json(post)
  } catch (err) {
    console.error('Error fetching blog post:', err)
    res.status(500).json({ error: 'Failed to fetch blog post' })
  }
})

export default router
