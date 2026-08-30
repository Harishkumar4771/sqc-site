/* ==========================================================================
   SEED SCRIPT — Populates SQLite DB from existing JSON/JS data files
   Run once: node server/seed.js
   ========================================================================== */

import db from './db.js'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const dataDir = path.join(__dirname, '..', 'src', 'data')

function readJSON(filename) {
  const raw = fs.readFileSync(path.join(dataDir, filename), 'utf-8')
  return JSON.parse(raw)
}

console.log('🌱 Seeding SQC database...\n')

/* ── Team ── */
const team = readJSON('team.json')
const insertTeam = db.prepare(`
  INSERT OR REPLACE INTO team_members (name, role, category, department, bio, image, linkedin, rotated, sort_order)
  VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
`)
let teamOrder = 0
for (const [category, members] of Object.entries(team)) {
  for (const m of members) {
    insertTeam.run(m.name, m.role, category, m.department || null, m.bio || null, m.image || null, m.linkedin || null, m.rotated ? 1 : 0, teamOrder++)
  }
}
console.log(`✅ Team: ${teamOrder} members seeded`)

/* ── Blog posts ── */
const blogs = readJSON('blog.json')
const insertBlog = db.prepare(`
  INSERT OR REPLACE INTO blog_posts (id, slug, title, date, category, read_time, excerpt, lead_summary, image, image_caption, author_name, author_role, author_dept, author_avatar, author_linkedin, tags)
  VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
`)
const insertSection = db.prepare(`
  INSERT INTO blog_sections (post_id, title, content, quote, code_snippet, sort_order)
  VALUES (?, ?, ?, ?, ?, ?)
`)
const insertTakeaway = db.prepare(`
  INSERT INTO blog_takeaways (post_id, takeaway, sort_order)
  VALUES (?, ?, ?)
`)

for (const b of blogs) {
  insertBlog.run(
    b.id, b.slug, b.title, b.date, b.category, b.readTime,
    b.excerpt, b.leadSummary, b.image, b.imageCaption,
    b.author?.name, b.author?.role, b.author?.department,
    b.author?.avatar, b.author?.linkedin,
    JSON.stringify(b.tags || [])
  )
  if (b.sections) {
    b.sections.forEach((s, i) => {
      insertSection.run(b.id, s.title, s.content, s.quote || null, s.codeSnippet || null, i)
    })
  }
  if (b.takeaways) {
    b.takeaways.forEach((t, i) => {
      insertTakeaway.run(b.id, t, i)
    })
  }
}
console.log(`✅ Blog: ${blogs.length} posts seeded`)

/* ── Events ── */
// Events file uses ES module export, so we parse it manually
const eventsRaw = fs.readFileSync(path.join(dataDir, 'events.js'), 'utf-8')
// Extract the array between `const EVENTS = [` and the last `]`
const eventsMatch = eventsRaw.match(/const EVENTS\s*=\s*\[([\s\S]*)\]\s*\n\s*export/)
if (eventsMatch) {
  // We'll use a different approach — import the module dynamically
  const { default: EVENTS } = await import(path.join(dataDir, 'events.js'))
  
  const insertEvent = db.prepare(`
    INSERT OR REPLACE INTO events (id, slug, title, subtitle, category, date, date_display, status, location, participants, duration, sessions, cover_image, excerpt, description, tags, registration_url, ibm_badge, qiskit_logo, gallery)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `)

  for (const e of EVENTS) {
    insertEvent.run(
      e.id, e.slug, e.title, e.subtitle || null, e.category, e.date,
      e.dateDisplay, e.status, e.location, e.participants, e.duration,
      e.sessions, e.coverImage || null, e.excerpt,
      JSON.stringify(e.description || []),
      JSON.stringify(e.tags || []),
      e.registrationUrl || null, e.ibmBadge || null, e.qiskitLogo || null,
      JSON.stringify(e.gallery || [])
    )
  }
  console.log(`✅ Events: ${EVENTS.length} events seeded`)
} else {
  console.log('⚠️  Could not parse events.js — skipping')
}

/* ── Testimonials ── */
const testimonials = readJSON('testimonials.json')
const insertTestimonial = db.prepare(`
  INSERT OR REPLACE INTO testimonials (id, quote, name, role)
  VALUES (?, ?, ?, ?)
`)
for (const t of testimonials) {
  insertTestimonial.run(t.id, t.quote, t.name, t.role)
}
console.log(`✅ Testimonials: ${testimonials.length} seeded`)

/* ── Pioneers ── */
const pioneers = readJSON('pioneers.json')
const insertPioneer = db.prepare(`
  INSERT OR REPLACE INTO pioneers (id, name, role, year, description, image)
  VALUES (?, ?, ?, ?, ?, ?)
`)
for (const p of pioneers) {
  insertPioneer.run(p.id, p.name, p.role, p.year, p.description, p.image)
}
console.log(`✅ Pioneers: ${pioneers.length} seeded`)

/* ── Timeline ── */
const timeline = readJSON('timeline.json')
const insertTimeline = db.prepare(`
  INSERT OR REPLACE INTO timeline (year, title, description)
  VALUES (?, ?, ?)
`)
for (const t of timeline) {
  insertTimeline.run(t.year, t.title, t.description)
}
console.log(`✅ Timeline: ${timeline.length} entries seeded`)

/* ── Stories ── */
const stories = readJSON('stories.json')
const insertStory = db.prepare(`
  INSERT OR REPLACE INTO stories (id, title, description, image)
  VALUES (?, ?, ?, ?)
`)
for (const s of stories) {
  insertStory.run(s.id, s.title, s.description, s.image)
}
console.log(`✅ Stories: ${stories.length} seeded`)

console.log('\n🎉 Database seeded successfully!')
console.log(`📁 Database location: ${path.join(__dirname, 'data', 'sqc.db')}`)
