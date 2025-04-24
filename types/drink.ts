export interface DrinkType {
  id: string
  name: string
  category: string
  abv: number
  imageUrl?: string
  isCustom?: boolean
  quantity?: {
    amount: number
    unit: string
  }
  timestamp?: string
  location?: string
  notes?: string
  instructions?: string
  glass?: string
  ingredients?: {
    name: string
    measure: string
  }[]
}
