export function renderRecipeCard({ id, image, name, active }) {
  const article = document.createElement('article')
  article.id = `recipe-${id}`

  const img = document.createElement('img')
  img.src = image || ''
  img.alt = name
  article.appendChild(img)

  const h2 = document.createElement('h2')
  h2.textContent = name
  article.appendChild(h2)

  const grid = document.createElement('div')
  grid.className = 'btn-grid'

  const viewBtn = document.createElement('button')
  viewBtn.textContent = 'Ver receta'
  viewBtn.className = 'btn-view'
  grid.appendChild(viewBtn)

  const toggleBtn = document.createElement('button')
  toggleBtn.textContent = active ? 'Desactivar' : 'Activar'
  toggleBtn.className = 'btn-toggle'
  grid.appendChild(toggleBtn)

  const editBtn = document.createElement('button')
  editBtn.textContent = 'Editar'
  editBtn.className = 'btn-edit'
  grid.appendChild(editBtn)

  const delBtn = document.createElement('button')
  delBtn.textContent = 'Eliminar'
  delBtn.className = 'btn-delete'
  grid.appendChild(delBtn)

  article.appendChild(grid)
  return article
}

export function renderList(items, checkedNames = new Set()) {
  const ul = document.createElement('ul')
  items.forEach(name => {
    const li = document.createElement('li')
    const checked = checkedNames.has(name) ? ' checked' : ''
    li.innerHTML = `<input type="checkbox" id="ing-${name}"${checked}> <label for="ing-${name}">${name}</label>`
    ul.appendChild(li)
  })
  return ul
}

export function renderMainPage(panel, listSection, cardDataList, activeNames, checkedNames) {
  panel.querySelectorAll('article').forEach(a => a.remove())
  cardDataList.forEach(d => panel.appendChild(renderRecipeCard(d)))

  const oldUl = listSection.querySelector('ul')
  if (oldUl) oldUl.remove()
  listSection.appendChild(renderList(activeNames, checkedNames))
}

export function renderRecipeDetail({ image, name, ingredients }) {
  const dialog = document.createElement('dialog')
  dialog.className = 'recipe-detail'

  const img = document.createElement('img')
  img.src = image || ''
  img.alt = name
  dialog.appendChild(img)

  const h2 = document.createElement('h2')
  h2.textContent = name
  dialog.appendChild(h2)

  const ul = document.createElement('ul')
  ingredients.forEach(i => {
    const li = document.createElement('li')
    li.textContent = i.quantity != null ? `${i.name} — ${i.quantity}${i.unit || ''}` : i.name
    ul.appendChild(li)
  })
  dialog.appendChild(ul)

  const calcBtn = document.createElement('button')
  calcBtn.textContent = 'Calcular cantidades'
  calcBtn.className = 'btn-calc'
  dialog.appendChild(calcBtn)

  const closeBtn = document.createElement('button')
  closeBtn.textContent = 'Cerrar'
  closeBtn.className = 'btn-close'
  dialog.appendChild(closeBtn)

  return { dialog, calcBtn, closeBtn }
}

export function renderQuantityCalculator(ingredients) {
  const dialog = document.createElement('dialog')
  dialog.className = 'calc-dialog'

  const h2 = document.createElement('h2')
  h2.textContent = 'Calcular cantidades'
  dialog.appendChild(h2)

  const inputs = []
  ingredients.forEach(i => {
    const row = document.createElement('div')
    row.className = 'calc-row'

    const nameSpan = document.createElement('span')
    nameSpan.textContent = i.name
    row.appendChild(nameSpan)

    const unitSpan = document.createElement('span')
    unitSpan.textContent = i.unit || ''
    row.appendChild(unitSpan)

    const inp = document.createElement('input')
    inp.type = 'number'
    inp.step = '1'
    inp.value = i.quantity || ''
    inp.dataset.name = i.name
    inp.dataset.unit = i.unit || ''
    inp.dataset.index = ingredients.indexOf(i)
    row.appendChild(inp)
    inputs.push(inp)

    dialog.appendChild(row)
  })

  const saveBtn = document.createElement('button')
  saveBtn.textContent = 'Guardar'
  saveBtn.className = 'calc-save'
  dialog.appendChild(saveBtn)

  const cancelBtn = document.createElement('button')
  cancelBtn.textContent = 'Cancelar'
  cancelBtn.className = 'calc-cancel'
  dialog.appendChild(cancelBtn)

  return { dialog, inputs, saveBtn, cancelBtn }
}

export function renderForm(recipeData) {
  const dialog = document.createElement('dialog')
  dialog.id = 'form-dialog'

  const form = document.createElement('form')
  form.id = 'recipe-form'

  const nameInput = document.createElement('input')
  nameInput.name = 'recipe-name'
  nameInput.placeholder = 'Nombre'
  nameInput.required = true
  form.appendChild(nameInput)

  const imageInput = document.createElement('input')
  imageInput.name = 'recipe-image'
  imageInput.type = 'url'
  imageInput.placeholder = 'URL de imagen'
  form.appendChild(imageInput)

  const container = document.createElement('div')
  container.id = 'ingredients-container'
  form.appendChild(container)

  const addIngredientBtn = document.createElement('button')
  addIngredientBtn.type = 'button'
  addIngredientBtn.id = 'add-ingredient'
  addIngredientBtn.textContent = '+ Añadir ingrediente'
  form.appendChild(addIngredientBtn)

  const submitBtn = document.createElement('button')
  submitBtn.type = 'submit'
  form.appendChild(submitBtn)

  const cancelBtn = document.createElement('button')
  cancelBtn.type = 'button'
  cancelBtn.id = 'cancel-btn'
  cancelBtn.textContent = 'Cancelar'
  form.appendChild(cancelBtn)

  dialog.appendChild(form)

  if (recipeData) {
    nameInput.value = recipeData.name
    imageInput.value = recipeData.image || ''
    submitBtn.textContent = 'Guardar cambios'
  } else {
    submitBtn.textContent = 'Guardar'
  }

  function addRow(data) {
    const div = document.createElement('div')
    div.className = 'ing-row'
    const name = document.createElement('input')
    name.name = 'ing-name'
    name.placeholder = 'Ingrediente'
    name.required = true
    if (data) name.value = data.name
    const unit = document.createElement('input')
    unit.name = 'ing-unit'
    unit.placeholder = 'Unidad'
    unit.step = '0.01'
    unit.required = true
    if (data) unit.value = data.unit || ''
    const quant = document.createElement('input')
    quant.name = 'ing-quant'
    quant.type = 'number'
    quant.placeholder = 'Cantidad'
    quant.step = '1'
    quant.required = true
    if (data) quant.value = data.quantity !== null && data.quantity !== undefined ? data.quantity : ''
    div.append(name, unit, quant)
    container.appendChild(div)
  }

  if (recipeData) {
    recipeData.ingredients.forEach(i => addRow(i))
  }

  return { dialog, form, container, addRow, cancelBtn, addIngredientBtn }
}
