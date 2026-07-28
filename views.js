export function renderRecipeCard({ id, image, name }) {
  const article = document.createElement('article')
  article.id = `recipe-${id}`

  const img = document.createElement('img')
  img.src = image || ''
  img.alt = name
  article.appendChild(img)

  const h2 = document.createElement('h2')
  h2.textContent = name
  article.appendChild(h2)

  const viewBtn = document.createElement('button')
  viewBtn.textContent = 'Ver receta'
  viewBtn.className = 'btn-view'
  article.appendChild(viewBtn)

  return article
}

export function renderList(items) {
  const ul = document.createElement('ul')
  items.forEach(name => {
    const li = document.createElement('li')
    li.innerHTML = `<input type="checkbox" id="ing-${name}"> <label for="ing-${name}">${name}</label>`
    ul.appendChild(li)
  })
  return ul
}

export function renderMainPage(panel, listSection, cardDataList, activeNames) {
  panel.querySelectorAll('article').forEach(a => a.remove())
  cardDataList.forEach(d => panel.appendChild(renderRecipeCard(d)))

  const oldUl = listSection.querySelector('ul')
  if (oldUl) oldUl.remove()
  listSection.appendChild(renderList(activeNames))
}

export function renderRecipeDetail({ image, name, ingredients, active }) {
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
    li.textContent = `${i.name} (${i.quantity || ''} ${i.unit || ''})`
    ul.appendChild(li)
  })
  dialog.appendChild(ul)

  const toggleBtn = document.createElement('button')
  toggleBtn.textContent = active ? 'Desactivar' : 'Activar'
  toggleBtn.className = 'btn-toggle'
  dialog.appendChild(toggleBtn)

  const deleteBtn = document.createElement('button')
  deleteBtn.textContent = 'Eliminar'
  deleteBtn.className = 'btn-delete'
  dialog.appendChild(deleteBtn)

  const closeBtn = document.createElement('button')
  closeBtn.textContent = 'Cerrar'
  closeBtn.className = 'btn-close'
  dialog.appendChild(closeBtn)

  return { dialog, toggleBtn, deleteBtn, closeBtn }
}

export function renderForm() {
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
  submitBtn.textContent = 'Guardar'
  form.appendChild(submitBtn)

  const cancelBtn = document.createElement('button')
  cancelBtn.type = 'button'
  cancelBtn.id = 'cancel-btn'
  cancelBtn.textContent = 'Cancelar'
  form.appendChild(cancelBtn)

  dialog.appendChild(form)

  function addRow() {
    const div = document.createElement('div')
    div.className = 'ing-row'
    const name = document.createElement('input')
    name.name = 'ing-name'
    name.placeholder = 'Ingrediente'
    name.required = true
    const unit = document.createElement('input')
    unit.name = 'ing-unit'
    unit.placeholder = 'Unidad'
    unit.step = '0.01'
    unit.required = true
    const quant = document.createElement('input')
    quant.name = 'ing-quant'
    quant.type = 'number'
    quant.placeholder = 'Cantidad'
    quant.step = '1'
    quant.required = true
    div.append(name, unit, quant)
    container.appendChild(div)
  }

  return { dialog, form, container, addRow, cancelBtn, addIngredientBtn }
}
