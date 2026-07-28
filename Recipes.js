/*
  Recipes:
    name: string
    ingredients: [ { name: string, unit: String, quantity: number } ]
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

  toggleActive() {
    this.active = !this.active
  }

  listIngredients() {
    return this.ingredients.map(i => i.name)
  }



  static notDuplicate(recipes) {
    const allNames = recipes.flatMap(r => r.listIngredients())
    return [...new Set(allNames)]
  }



}
