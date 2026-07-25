import { Recipes } from './Recipes.js'
import { ListMaker } from './ListMaker.js'


const addRecipe = document.getElementById('add-recipe')
addRecipe.addEventListener('click', () => {
document.getElementById('form-dialog').showModal()
})


const cancelBtn = document.getElementById('cancel-btn')
cancelBtn.addEventListener('click', () => {
    document.getElementById('form-dialog').close()
  })



const recipeForm = document.getElementById('recipe-form')
recipeForm.addEventListener('submit', async (e) => {
  e.preventDefault()
  const ok = await submitRecipe()
  if (ok) {
    document.getElementById('form-dialog').close()
    loadRecipes()
  }
})

const addBtn = document.getElementById('add-ingredient')
const container = document.getElementById('ingredients-container')

addBtn.addEventListener('click', () => {
  const firstRow = container.querySelector('.ing-row')
  const newRow = firstRow.cloneNode(true)
  newRow.querySelectorAll('input').forEach(input => input.value = '')
  container.appendChild(newRow)
})








function recipeView(recipe) {
  const article = document.createElement('article')
  article.id = `recipe-${recipe.dbId}`

  if (recipe.image) {
    const img = document.createElement('img')
    img.src = recipe.image
    img.alt = recipe.name
    article.appendChild(img)
  }

  const h2 = document.createElement('h2')
  h2.textContent = recipe.name
  article.appendChild(h2)

  const ul = document.createElement('ul')
  recipe.ingredients.forEach(i => {
    const li = document.createElement('li')
    li.textContent = i.name
    ul.appendChild(li)
  })
  article.appendChild(ul)

  const toggle = document.createElement('button')
  toggle.textContent = recipe.active ? 'Desactivar' : 'Activar'
  toggle.addEventListener('click', async () => {
    await fetch(`/api/recipes/${recipe.dbId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: recipe.name,
        ingredients: recipe.ingredients,
        image: recipe.image,
        active: !recipe.active
      })
    })
    loadRecipes()
  })
  article.appendChild(toggle)

  const del = document.createElement('button')
  del.textContent = 'Eliminar'
  del.addEventListener('click', async () => {
    await fetch(`/api/recipes/${recipe.dbId}`, { method: 'DELETE' })
    loadRecipes()
  })
  article.appendChild(del)

  return article
}



function listView(ingredientNames) {
  const ul = document.getElementById('list-ingredients')
  ul.innerHTML = ''
  ingredientNames.forEach(name => {
    const li = document.createElement('li')
    li.innerHTML = `<input type="checkbox" id="ing-${name}"> <label for="ing-${name}">${name}</label>`
    ul.appendChild(li)
  })
}

async function submitRecipe() {
  const ingredients = []
  document.querySelectorAll('.ing-row').forEach(row => {
    const inputs = row.querySelectorAll('input')
    ingredients.push({
      name: inputs[0].value,
      proportion: parseFloat(inputs[1].value)
    })
  })

  const res = await fetch('/api/recipes', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name: document.querySelector('[name="recipe-name"]').value,
      ingredients,
      image: document.querySelector('[name="recipe-image"]').value || null,
      active: false
    })
  })

  return res.ok
}

async function loadRecipes() {
  const res = await fetch('/api/recipes')
  const data = await res.json()
  const recipes = data.map(r => {
    const recipe = new Recipes(r.name, r.ingredients, r.active, r.image)
    recipe.dbId = r.id
    return recipe
  })

  const panel = document.getElementById('recipes-panel')
  panel.querySelectorAll('article').forEach(a => a.remove())
  recipes.forEach(r => panel.appendChild(recipeView(r)))

  const active = recipes.filter(r => r.active)
  listView(ListMaker.notDuplicate(active))
}

loadRecipes()
