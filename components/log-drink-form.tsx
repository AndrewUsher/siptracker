"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft, ArrowRight, Check } from "lucide-react"
import { DrinkSearch } from "@/components/drink-search"
import { DrinkDetails } from "@/components/drink-details"
import { DrinkReview } from "@/components/drink-review"
import type { DrinkType } from "@/types/drink"

const STEPS = [
  { id: "search", title: "Find Drink" },
  { id: "details", title: "Add Details" },
  { id: "review", title: "Review & Save" },
]

export function LogDrinkForm() {
  const [step, setStep] = useState(0)
  const [drinkData, setDrinkData] = useState<DrinkType | null>(null)

  const handleNext = () => {
    if (step < STEPS.length - 1) {
      setStep(step + 1)
    }
  }

  const handleBack = () => {
    if (step > 0) {
      setStep(step - 1)
    }
  }

  const handleSelectDrink = (drink: DrinkType) => {
    setDrinkData(drink)
    handleNext()
  }

  const handleUpdateDetails = (details: Partial<DrinkType>) => {
    setDrinkData((prev) => ({ ...prev!, ...details }))
    handleNext()
  }

  const handleSubmit = () => {
    // In a real app, this would save to a database
    console.log("Saving drink:", drinkData)

    // Reset form and show success message
    setDrinkData(null)
    setStep(0)

    // Show success toast or message
    alert("Drink logged successfully!")
  }

  return (
    <Card className="p-6">
      <div className="mb-8">
        <div className="flex justify-between mb-2">
          {STEPS.map((s, i) => (
            <div key={s.id} className="flex flex-col items-center">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center mb-2 ${
                  i < step
                    ? "bg-green-500 text-white"
                    : i === step
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-muted-foreground"
                }`}
              >
                {i < step ? <Check className="h-4 w-4" /> : i + 1}
              </div>
              <span className={`text-xs ${i === step ? "font-medium" : "text-muted-foreground"}`}>{s.title}</span>
            </div>
          ))}
        </div>
        <div className="w-full bg-muted h-2 rounded-full mt-2">
          <div
            className="bg-primary h-2 rounded-full transition-all"
            style={{ width: `${((step + 1) / STEPS.length) * 100}%` }}
          />
        </div>
      </div>

      <div className="min-h-[400px]">
        {step === 0 && <DrinkSearch onSelectDrink={handleSelectDrink} />}
        {step === 1 && <DrinkDetails initialData={drinkData} onSave={handleUpdateDetails} />}
        {step === 2 && <DrinkReview drinkData={drinkData} onSubmit={handleSubmit} />}
      </div>

      <div className="flex justify-between mt-6">
        <Button variant="outline" onClick={handleBack} disabled={step === 0} className="flex items-center gap-2">
          <ArrowLeft className="h-4 w-4" /> Back
        </Button>

        {step < STEPS.length - 1 ? (
          <Button onClick={handleNext} disabled={step === 0 && !drinkData} className="flex items-center gap-2">
            Next <ArrowRight className="h-4 w-4" />
          </Button>
        ) : (
          <Button onClick={handleSubmit} className="flex items-center gap-2">
            Save Log <Check className="h-4 w-4" />
          </Button>
        )}
      </div>
    </Card>
  )
}
