"use client"

import { format } from "date-fns"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Check, Edit2 } from "lucide-react"
import type { DrinkType } from "@/types/drink"

interface DrinkReviewProps {
  drinkData: DrinkType | null
  onSubmit: () => void
}

export function DrinkReview({ drinkData, onSubmit }: DrinkReviewProps) {
  if (!drinkData) {
    return <div>No drink data available</div>
  }

  const formattedDate = drinkData.timestamp ? format(new Date(drinkData.timestamp), "PPP 'at' h:mm a") : "Not specified"

  // Display ingredients if available
  const hasIngredients = drinkData.ingredients && drinkData.ingredients.length > 0

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h2 className="text-2xl font-bold">Review & Save</h2>
        <p className="text-muted-foreground">Confirm your drink details before saving</p>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center gap-4 pb-2">
          <div className="w-16 h-16 bg-muted rounded-md flex items-center justify-center overflow-hidden">
            <img
              src={drinkData.imageUrl || "/placeholder.svg?height=64&width=64"}
              alt={drinkData.name}
              className="object-cover w-full h-full"
            />
          </div>
          <div>
            <CardTitle>{drinkData.name}</CardTitle>
            <CardDescription>{drinkData.category}</CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <dl className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
            <dt className="font-medium">Quantity</dt>
            <dd>{drinkData.quantity ? `${drinkData.quantity.amount} ${drinkData.quantity.unit}` : "Not specified"}</dd>

            <dt className="font-medium">ABV</dt>
            <dd>{drinkData.abv}%</dd>

            <dt className="font-medium">When</dt>
            <dd>{formattedDate}</dd>

            {drinkData.location && (
              <>
                <dt className="font-medium">Location</dt>
                <dd>{drinkData.location}</dd>
              </>
            )}

            {drinkData.notes && (
              <>
                <dt className="col-span-2 font-medium mt-2">Notes</dt>
                <dd className="col-span-2 bg-muted p-2 rounded-md">{drinkData.notes}</dd>
              </>
            )}

            {hasIngredients && (
              <>
                <dt className="col-span-2 font-medium mt-2">Ingredients</dt>
                <dd className="col-span-2">
                  <ul className="list-disc pl-5 space-y-1">
                    {drinkData.ingredients?.map((ingredient, index) => (
                      <li key={index}>
                        {ingredient.measure} {ingredient.name}
                      </li>
                    ))}
                  </ul>
                </dd>
              </>
            )}

            {drinkData.instructions && (
              <>
                <dt className="col-span-2 font-medium mt-2">Instructions</dt>
                <dd className="col-span-2 bg-muted p-2 rounded-md">{drinkData.instructions}</dd>
              </>
            )}
          </dl>
        </CardContent>
      </Card>

      <div className="flex flex-col gap-2">
        <Button onClick={onSubmit} className="flex items-center gap-2">
          <Check className="h-4 w-4" /> Save to Drink Log
        </Button>
        <Button variant="outline" className="flex items-center gap-2">
          <Edit2 className="h-4 w-4" /> Edit Details
        </Button>
      </div>
    </div>
  )
}
