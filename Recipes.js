/*
  Recipes:
    name: string
    ingredients: [ { name: string, proportion: number } ]
    active: boolean
    image: string | null
*/
export class Recipes {

  constructor(name, ingredients, active = false, image = null) {
    this.name = name
    this.ingredients = ingredients
    this.active = active
    this.image = image
  }

  changeActive() {
    this.active = true
  }

  listIngredients() {
    return this.ingredients.map(i => i.name)
  }

  /*given one ingredient with an absolute quantity, scales all other ingredients proportionally*/
  proportionsToQuantities(ingredient) {
    const found = this.ingredients.find(i => i.name === ingredient.name)
    if (!found) return null

    return this.ingredients.map(i => ({
      name: i.name,
      quantity: ingredient.quantity * i.proportion / found.proportion
    }))
  }

  /*converts absolute ingredient quantities into proportions summing to 1*/
  static quantitiesToProportions(quantityIngredients) {
    let total = 0
    for (const ingredient of quantityIngredients) {
      total += ingredient.quantity
    }

    return quantityIngredients.map(i => ({
      name: i.name,
      proportion: i.quantity / total
    }))
  }

}