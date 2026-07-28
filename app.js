import { Recipes } from './Recipes.js'
import { fetchRecipes, postRecipes, putRecipes, deleteRecipes } from './api.js'
import { renderMainPage, renderRecipeDetail, renderForm } from './views.js'

const addRecipe = document.getElementById('add-recipe')
const panel = document.getElementById('recipes-panel')
const listSection = document.getElementById('list-active-ingredients')

// ---- Form helpers ----

function collectIngredients() {
  const ingredients = []
  document.querySelectorAll('.ing-row').forEach(row => {
    const inputs = row.querySelectorAll('input')
    ingredients.push({
      name: inputs[0].value,
      unit: 'g',
      quantity: parseFloat(inputs[1].value)
    })
  })
  return ingredients
}

function extractRecipe() {
  return {
    name: document.querySelector('[name="recipe-name"]').value,
    ingredients: collectIngredients(),
    image: document.querySelector('[name="recipe-image"]').value || null,
    active: false
  }
}

// ---- Page orchestration ----

let recipes = []

async function loadPage() {
  recipes = await fetchRecipes()

  const cardDataList = recipes.map(r => ({
    id: r.dbId,
    image: r.image,
    name: r.name
  }))

  const activeNames = Recipes.notDuplicate(recipes.filter(r => r.active))

  renderMainPage(panel, listSection, cardDataList, activeNames)
}

// ---- Page events ----

panel.addEventListener('click', async (e) => {
  const article = e.target.closest('article')
  if (!article) return

  const id = Number(article.id.replace('recipe-', ''))
  const recipe = recipes.find(r => r.dbId === id)
  if (!recipe) return

  if (e.target.matches('.btn-view')) {
    const { dialog, toggleBtn, deleteBtn, closeBtn } = renderRecipeDetail({
      image: recipe.image,
      name: recipe.name,
      ingredients: recipe.ingredients,
      active: recipe.active
    })
    document.body.appendChild(dialog)
    dialog.showModal()

    closeBtn.addEventListener('click', () => dialog.close())

    toggleBtn.addEventListener('click', async () => {
      recipe.toggleActive()
      await putRecipes(recipe.dbId, { name: recipe.name, ingredients: recipe.ingredients, image: recipe.image, active: recipe.active })
      dialog.close()
    })

    deleteBtn.addEventListener('click', async () => {
      await deleteRecipes(recipe.dbId)
      dialog.close()
    })

    dialog.addEventListener('close', () => {
      dialog.remove()
      loadPage()
    })
  }
})

// ---- Form events ----

const { dialog, form, cancelBtn, addIngredientBtn, addRow } = renderForm()
document.body.appendChild(dialog)

addRecipe.addEventListener('click', () => dialog.showModal())
cancelBtn.addEventListener('click', () => dialog.close())
form.addEventListener('submit', async (e) => {
  e.preventDefault()
  const data = extractRecipe()
  const id = await postRecipes(data)
  if (id) {
    dialog.close()
    loadPage()
  }
})
addIngredientBtn.addEventListener('click', addRow)

// ---- Start ----

loadPage()
