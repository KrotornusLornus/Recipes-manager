import express from 'express'
import Database from 'better-sqlite3'

const app = express()
const db = new Database('recipes.db')

db.prepare(`CREATE TABLE IF NOT EXISTS recipes (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  ingredients TEXT NOT NULL,
  active INTEGER DEFAULT 0,
  image TEXT DEFAULT NULL
)`).run()

app.use(express.json())
app.use(express.static('.'))

app.get('/api/recipes', (req, res) => {
  const recipes = db.prepare('SELECT * FROM recipes').all()
  res.json(recipes.map(r => ({ ...r, ingredients: JSON.parse(r.ingredients), active: !!r.active })))
})

app.get('/api/recipes/:id', (req, res) => {
  const recipe = db.prepare('SELECT * FROM recipes WHERE id = ?').get(req.params.id)
  if (!recipe) return res.status(404).json({ error: 'not found' })
  res.json({ ...recipe, ingredients: JSON.parse(recipe.ingredients), active: !!recipe.active })
})

app.post('/api/recipes', (req, res) => {
  const { name, ingredients, active, image } = req.body
  const result = db.prepare('INSERT INTO recipes (name, ingredients, active, image) VALUES (?, ?, ?, ?)').run(
    name, JSON.stringify(ingredients), active ? 1 : 0, image || null
  )
  res.status(201).json({ id: result.lastInsertRowid })
})

app.put('/api/recipes/:id', (req, res) => {
  const { name, ingredients, active, image } = req.body
  const result = db.prepare('UPDATE recipes SET name = ?, ingredients = ?, active = ?, image = ? WHERE id = ?').run(
    name, JSON.stringify(ingredients), active ? 1 : 0, image || null, req.params.id
  )
  if (result.changes === 0) return res.status(404).json({ error: 'not found' })
  res.json({ message: 'ok' })
})

app.delete('/api/recipes/:id', (req, res) => {
  const result = db.prepare('DELETE FROM recipes WHERE id = ?').run(req.params.id)
  if (result.changes === 0) return res.status(404).json({ error: 'not found' })
  res.json({ message: 'ok' })
})

app.listen(process.env.PORT || 3000, () => console.log('Server at http://localhost:' + (process.env.PORT || 3000)))
