"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Search, Plus, CoffeeIcon as Cocktail, Beer, Wine, Loader2 } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card } from "@/components/ui/card"
import { useQuery } from "@tanstack/react-query"
import { searchDrinks, getDrinksByCategory, mapApiDrinkToAppDrink } from "@/lib/api"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"
import type { DrinkType } from "@/types/drink"
import { DrinkDetailsModal } from "@/components/drink-details-modal"

const CATEGORIES = [
  { id: "all", name: "All", icon: Cocktail },
  { id: "Cocktail", name: "Cocktails", icon: Cocktail },
  { id: "Beer", name: "Beer", icon: Beer },
  { id: "Wine", name: "Wine", icon: Wine },
]

interface DrinkSearchProps {
  onSelectDrink: (drink: DrinkType) => void
}

export function DrinkSearch({ onSelectDrink }: DrinkSearchProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [debouncedSearch, setDebouncedSearch] = useState("")
  const [category, setCategory] = useState("all")
  const [selectedDrinkId, setSelectedDrinkId] = useState<string | null>(null)
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false)

  // Debounce search term to avoid too many API calls
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm)
    }, 500)

    return () => clearTimeout(timer)
  }, [searchTerm])

  // Query for search results
  const searchQuery = useQuery({
    queryKey: ["searchDrinks", debouncedSearch],
    queryFn: () => searchDrinks(debouncedSearch),
    enabled: debouncedSearch.length > 0,
  })

  // Query for category results
  const categoryQuery = useQuery({
    queryKey: ["drinksByCategory", category],
    queryFn: () => getDrinksByCategory(category),
    enabled: category !== "all" && !debouncedSearch,
  })

  // Process and filter drinks based on search and category
  const processedDrinks = (() => {
    // If we're searching, use search results
    if (debouncedSearch && searchQuery.data?.drinks) {
      const drinks = searchQuery.data.drinks.map(mapApiDrinkToAppDrink)

      // If category is selected, filter by category
      if (category !== "all") {
        return drinks.filter((drink) => drink.category.toLowerCase() === category.toLowerCase())
      }

      return drinks
    }

    // If category is selected (and not searching), use category results
    if (category !== "all" && categoryQuery.data?.drinks) {
      return categoryQuery.data.drinks.map((drink: any) => ({
        id: drink.idDrink,
        name: drink.strDrink,
        category: category,
        abv: 0, // We don't have ABV from category endpoint
        imageUrl: drink.strDrinkThumb,
        isCustom: false,
      }))
    }

    // Default: empty array if no results or still loading
    return []
  })()

  const isLoading = searchQuery.isLoading || categoryQuery.isLoading
  const isError = searchQuery.isError || categoryQuery.isError
  const error = searchQuery.error || categoryQuery.error

  const handleViewDetails = (e: React.MouseEvent, drinkId: string) => {
    e.stopPropagation() // Prevent the card click from triggering
    setSelectedDrinkId(drinkId)
    setIsDetailsModalOpen(true)
  }

  const handleCreateCustom = () => {
    const customDrink: DrinkType = {
      id: `custom-${Date.now()}`,
      name: searchTerm || "Custom Drink",
      category: "Custom",
      abv: 0,
      imageUrl: "/placeholder.svg?height=100&width=100",
      isCustom: true,
    }
    onSelectDrink(customDrink)
  }

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h2 className="text-2xl font-bold">Find Your Drink</h2>
        <p className="text-muted-foreground">Search for a drink or create a custom entry</p>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search drinks..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      <Tabs defaultValue="all" onValueChange={setCategory}>
        <TabsList className="grid grid-cols-4">
          {CATEGORIES.map((cat) => {
            const Icon = cat.icon
            return (
              <TabsTrigger key={cat.id} value={cat.id} className="flex items-center gap-2">
                <Icon className="h-4 w-4" />
                <span className="hidden sm:inline">{cat.name}</span>
              </TabsTrigger>
            )
          })}
        </TabsList>

        <TabsContent value={category} className="mt-6">
          {isLoading ? (
            <div className="flex justify-center items-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <span className="sr-only">Loading...</span>
            </div>
          ) : isError ? (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>
                {error instanceof Error ? error.message : "Failed to load drinks. Please try again."}
              </AlertDescription>
            </Alert>
          ) : processedDrinks.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {processedDrinks.map((drink) => (
                <Card
                  key={drink.id}
                  className="overflow-hidden cursor-pointer hover:border-primary transition-colors"
                  onClick={() => onSelectDrink(drink)}
                >
                  <div className="flex">
                    <div className="w-24 h-24 bg-muted flex items-center justify-center">
                      <img
                        src={drink.imageUrl || "/placeholder.svg?height=100&width=100"}
                        alt={drink.name}
                        className="object-cover w-full h-full"
                      />
                    </div>
                    <div className="flex-1 p-4">
                      <h3 className="font-medium">{drink.name}</h3>
                      <div className="flex items-center justify-between mt-2">
                        <span className="text-xs bg-muted px-2 py-1 rounded-full">{drink.category}</span>
                        <span className="text-xs font-medium">{drink.abv}% ABV</span>
                      </div>
                      {!drink.isCustom && (
                        <Button
                          variant="ghost"
                          size="sm"
                          className="mt-2 text-xs h-7 px-2"
                          onClick={(e) => handleViewDetails(e, drink.id)}
                        >
                          View Details
                        </Button>
                      )}
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-muted-foreground mb-4">
                {debouncedSearch
                  ? `No drinks found matching "${debouncedSearch}"`
                  : "Search for a drink or select a category"}
              </p>
              <Button onClick={handleCreateCustom} className="flex items-center gap-2">
                <Plus className="h-4 w-4" /> Create Custom Drink
              </Button>
            </div>
          )}
        </TabsContent>
      </Tabs>

      <div className="flex justify-center pt-4">
        <Button variant="outline" onClick={handleCreateCustom} className="flex items-center gap-2">
          <Plus className="h-4 w-4" /> Add Custom Drink
        </Button>
      </div>

      <DrinkDetailsModal
        drinkId={selectedDrinkId}
        isOpen={isDetailsModalOpen}
        onClose={() => setIsDetailsModalOpen(false)}
      />
    </div>
  )
}
