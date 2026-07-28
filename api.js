import { Recipes } from './Recipes.js'

const CACHE_KEY = 'foodmanager-recipes'

export async function getRecipes(id) {
  const url = id ? `/api/recipes/${id}` : '/api/recipes'
  const res = await fetch(url)
  const data = await res.json()
  localStorage.setItem(CACHE_KEY, JSON.stringify(data))
  return data
}

export async function postRecipes(data) {
  const res = await fetch('/api/recipes', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  })
  const result = await res.json()
  return result.id
}

export async function putRecipes(id, data) {
  await fetch(`/api/recipes/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  })
}

export async function deleteRecipes(id) {
  await fetch(`/api/recipes/${id}`, { method: 'DELETE' })
}

export function getCachedRecipes() {
  const data = localStorage.getItem(CACHE_KEY)
  return data ? JSON.parse(data) : []
}

export async function fetchRecipes() {
  let data
  try {
    data = await getRecipes()
  } catch {
    data = getCachedRecipes()
  }
  return data.map(r => {
    const recipe = new Recipes(r.name, r.ingredients, r.active, r.image)
    recipe.dbId = r.id
    return recipe
  })
}
