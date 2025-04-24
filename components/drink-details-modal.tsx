"use client"

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { useQuery } from "@tanstack/react-query"
import { getDrinkById, mapApiDrinkToAppDrink } from "@/lib/api"
import { Loader2 } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"
import { Badge } from "@/components/ui/badge"

interface DrinkDetailsModalProps {
  drinkId: string | null
  isOpen: boolean
  onClose: () => void
}

export function DrinkDetailsModal({ drinkId, isOpen, onClose }: DrinkDetailsModalProps) {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["drinkDetails", drinkId],
    queryFn: () => getDrinkById(drinkId!),
    enabled: !!drinkId && isOpen,
  })

  const drink = data?.drinks?.[0] ? mapApiDrinkToAppDrink(data.drinks[0]) : null

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
        {isLoading ? (
          <div className="flex justify-center items-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : isError ? (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>
              {error instanceof Error ? error.message : "Failed to load drink details."}
            </AlertDescription>
          </Alert>
        ) : drink ? (
          <>
            <DialogHeader>
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-md overflow-hidden">
                  <img
                    src={drink.imageUrl || "/placeholder.svg"}
                    alt={drink.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <DialogTitle>{drink.name}</DialogTitle>
                  <DialogDescription className="flex items-center gap-2 mt-1">
                    <Badge variant="outline">{drink.category}</Badge>
                    {drink.glass && <span className="text-xs">Served in: {drink.glass}</span>}
                  </DialogDescription>
                </div>
              </div>
            </DialogHeader>

            <div className="grid gap-4 py-4">
              {drink.ingredients && drink.ingredients.length > 0 && (
                <div>
                  <h3 className="font-medium mb-2">Ingredients</h3>
                  <ul className="list-disc pl-5 space-y-1">
                    {drink.ingredients.map((ingredient, index) => (
                      <li key={index}>
                        {ingredient.measure} {ingredient.name}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {drink.instructions && (
                <div>
                  <h3 className="font-medium mb-2">Instructions</h3>
                  <p className="text-sm">{drink.instructions}</p>
                </div>
              )}

              <div className="flex items-center justify-between text-sm">
                <span>Estimated ABV</span>
                <Badge variant="secondary">{drink.abv}%</Badge>
              </div>
            </div>
          </>
        ) : (
          <div className="text-center py-8">
            <p>No drink details available</p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
