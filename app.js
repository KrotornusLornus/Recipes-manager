import { Recipes } from './Recipes.js'
import { fetchRecipes, postRecipes, putRecipes, deleteRecipes } from './api.js'
import { renderMainPage, renderRecipeDetail, renderQuantityCalculator, renderForm } from './views.js'

const addRecipe = document.getElementById('add-recipe')
const panel = document.getElementById('recipes-panel')
const listSection = document.getElementById('list-active-ingredients')

// ---- Form helpers ----

function collectIngredients(scope) {
  const root = scope || document
  const ingredients = []
  root.querySelectorAll('.ing-row').forEach(row => {
    const inputs = row.querySelectorAll('input')
    ingredients.push({
      name: inputs[0].value,
      unit: inputs[1].value,
      quantity: parseFloat(inputs[2].value)
    })
  })
  return ingredients
}

function extractRecipe(scope) {
  const root = scope || document
  return {
    name: root.querySelector('[name="recipe-name"]').value,
    ingredients: collectIngredients(scope),
    image: root.querySelector('[name="recipe-image"]').value || null,
    active: false
  }
}

// ---- Page orchestration ----

let recipes = []

const CHECKED_KEY = 'foodmanager-checked'

function saveChecked(names) {
  localStorage.setItem(CHECKED_KEY, JSON.stringify([...names]))
}

function loadChecked() {
  const data = localStorage.getItem(CHECKED_KEY)
  return data ? new Set(JSON.parse(data)) : new Set()
}

async function loadPage() {
  recipes = await fetchRecipes()

  const cardDataList = recipes.map(r => ({
    id: r.dbId,
    image: r.image,
    name: r.name,
    active: r.active
  }))

  const activeNames = Recipes.notDuplicate(recipes.filter(r => r.active))
  const checkedNames = loadChecked()

  renderMainPage(panel, listSection, cardDataList, activeNames, checkedNames)
}

listSection.addEventListener('change', (e) => {
  if (!e.target.matches('input[type="checkbox"]')) return
  const checked = loadChecked()
  const name = e.target.id.replace('ing-', '')
  if (e.target.checked) checked.add(name)
  else checked.delete(name)
  saveChecked(checked)
})

// ---- Page events ----

panel.addEventListener('click', async (e) => {
  const article = e.target.closest('article')
  if (!article) return

  const id = Number(article.id.replace('recipe-', ''))
  const recipe = recipes.find(r => r.dbId === id)
  if (!recipe) return

  if (e.target.matches('.btn-toggle')) {
    recipe.toggleActive()
    try {
      await putRecipes(recipe.dbId, { name: recipe.name, ingredients: recipe.ingredients, image: recipe.image, active: recipe.active })
    } catch {
      alert('Sin conexión, no se pudo guardar')
      return
    }
    loadPage()
  } else if (e.target.matches('.btn-delete')) {
    if (!confirm('¿Estás seguro de eliminar esta receta?')) return
    try {
      await deleteRecipes(recipe.dbId)
    } catch {
      alert('Sin conexión, no se pudo eliminar')
      return
    }
    loadPage()
  } else if (e.target.matches('.btn-view')) {
    const { dialog, calcBtn, closeBtn } = renderRecipeDetail({
      image: recipe.image,
      name: recipe.name,
      ingredients: recipe.ingredients
    })
    document.body.appendChild(dialog)
    dialog.showModal()

    closeBtn.addEventListener('click', () => dialog.close())

    calcBtn.addEventListener('click', () => {
      const calc = renderQuantityCalculator(recipe.ingredients)
      document.body.appendChild(calc.dialog)
      calc.dialog.showModal()

      calc.inputs.forEach((inp, idx) => {
        inp.addEventListener('input', () => {
          const scaled = Recipes.scaleProportionally(recipe.ingredients, idx, parseFloat(inp.value) || 0)
          calc.inputs.forEach((other, otherIdx) => {
            if (otherIdx !== idx) other.value = scaled[otherIdx].quantity
          })
        })
      })

      calc.saveBtn.addEventListener('click', async () => {
        const newIngredients = calc.inputs.map(inp => ({
          name: inp.dataset.name,
          unit: inp.dataset.unit,
          quantity: parseFloat(inp.value) || 0
        }))
        recipe.ingredients = newIngredients
        try {
          await putRecipes(recipe.dbId, { name: recipe.name, ingredients: newIngredients, image: recipe.image, active: recipe.active })
        } catch {
          alert('Sin conexión, no se pudo guardar')
          return
        }
        calc.dialog.close()
        calc.dialog.remove()
        dialog.close()
      })

      calc.cancelBtn.addEventListener('click', () => calc.dialog.close())

      calc.dialog.addEventListener('close', () => {
        calc.dialog.remove()
      })
    })

    dialog.addEventListener('close', () => {
      dialog.remove()
      loadPage()
    })
  } else if (e.target.matches('.btn-edit')) {
    const edit = renderForm({
      name: recipe.name,
      image: recipe.image,
      ingredients: recipe.ingredients
    })
    document.body.appendChild(edit.dialog)
    edit.dialog.showModal()

    edit.cancelBtn.addEventListener('click', () => edit.dialog.close())

    edit.form.addEventListener('submit', async (ev) => {
      ev.preventDefault()
      const data = extractRecipe(edit.form)
      try {
        await putRecipes(recipe.dbId, data)
      } catch {
        alert('Sin conexión, no se pudo guardar')
        return
      }
      edit.dialog.close()
    })

    edit.dialog.addEventListener('close', () => {
      edit.dialog.remove()
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
  let id
  try {
    id = await postRecipes(data)
  } catch {
    alert('Sin conexión, no se pudo guardar')
    return
  }
  if (id) {
    dialog.close()
    loadPage()
  }
})
addIngredientBtn.addEventListener('click', addRow)

// ---- Start ----

loadPage()
