const API_BASE_URL = "https://www.thecocktaildb.com/api/json/v1/1"

// Function to search drinks by name
export async function searchDrinks(query: string) {
  if (!query || query.trim() === "") {
    return { drinks: [] }
  }

  const response = await fetch(`${API_BASE_URL}/search.php?s=${encodeURIComponent(query)}`)

  if (!response.ok) {
    throw new Error(`API error: ${response.status}`)
  }

  return response.json()
}

// Function to get drink details by ID
export async function getDrinkById(id: string) {
  const response = await fetch(`${API_BASE_URL}/lookup.php?i=${id}`)

  if (!response.ok) {
    throw new Error(`API error: ${response.status}`)
  }

  return response.json()
}

// Function to get drinks by category
export async function getDrinksByCategory(category: string) {
  const response = await fetch(`${API_BASE_URL}/filter.php?c=${encodeURIComponent(category)}`)

  if (!response.ok) {
    throw new Error(`API error: ${response.status}`)
  }

  return response.json()
}

// Function to get all categories
export async function getCategories() {
  const response = await fetch(`${API_BASE_URL}/list.php?c=list`)

  if (!response.ok) {
    throw new Error(`API error: ${response.status}`)
  }

  return response.json()
}

// Helper function to calculate estimated ABV based on ingredients
// This is an approximation since TheCocktailDB doesn't provide ABV directly
export function estimateABV(drink: any): number {
  // Common alcoholic ingredients and their approximate ABV
  const alcoholContent: Record<string, number> = {
    vodka: 40,
    gin: 40,
    rum: 40,
    whiskey: 40,
    whisky: 40,
    tequila: 40,
    bourbon: 40,
    brandy: 40,
    cognac: 40,
    scotch: 40,
    beer: 5,
    wine: 12,
    champagne: 12,
    liqueur: 25,
    vermouth: 18,
    "triple sec": 30,
    kahlua: 20,
    baileys: 17,
    amaretto: 28,
  }

  // Check if it's non-alcoholic
  if (drink.strAlcoholic === "Non alcoholic") {
    return 0
  }

  // Look for alcoholic ingredients
  let totalAlcoholContent = 0
  let alcoholicIngredients = 0

  // TheCocktailDB stores ingredients in properties from strIngredient1 to strIngredient15
  for (let i = 1; i <= 15; i++) {
    const ingredient = drink[`strIngredient${i}`]?.toLowerCase()
    if (!ingredient) continue

    // Check if this ingredient is in our alcohol list
    for (const [alcoholName, abv] of Object.entries(alcoholContent)) {
      if (ingredient.includes(alcoholName)) {
        totalAlcoholContent += abv
        alcoholicIngredients++
        break
      }
    }
  }

  // If we found alcoholic ingredients, calculate an average
  if (alcoholicIngredients > 0) {
    // Dilute based on number of ingredients (simple approximation)
    const totalIngredients = Object.keys(drink).filter((key) => key.startsWith("strIngredient") && drink[key]).length

    // Calculate estimated ABV (diluted by non-alcoholic ingredients)
    return (
      Math.round((totalAlcoholContent / alcoholicIngredients) * (alcoholicIngredients / totalIngredients) * 10) / 10
    )
  }

  // Default ABV for alcoholic drinks with no recognized alcoholic ingredients
  return drink.strAlcoholic === "Alcoholic" ? 5 : 0
}

// Map API drink to our app's drink type
export function mapApiDrinkToAppDrink(apiDrink: any) {
  return {
    id: apiDrink.idDrink,
    name: apiDrink.strDrink,
    category: apiDrink.strCategory || "Uncategorized",
    abv: estimateABV(apiDrink),
    imageUrl: apiDrink.strDrinkThumb,
    instructions: apiDrink.strInstructions,
    glass: apiDrink.strGlass,
    ingredients: getIngredientsFromDrink(apiDrink),
    isCustom: false,
  }
}

// Helper to extract ingredients and measures from API response
function getIngredientsFromDrink(drink: any) {
  const ingredients = []

  for (let i = 1; i <= 15; i++) {
    const ingredient = drink[`strIngredient${i}`]
    const measure = drink[`strMeasure${i}`]

    if (ingredient) {
      ingredients.push({
        name: ingredient,
        measure: measure || "to taste",
      })
    }
  }

  return ingredients
}
