"use client"

import { useState } from "react"
import { CalendarIcon, Clock } from "lucide-react"
import { format } from "date-fns"
import { Calendar } from "@/components/ui/calendar"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Textarea } from "@/components/ui/textarea"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { DrinkType } from "@/types/drink"

interface DrinkDetailsProps {
  initialData: DrinkType | null
  onSave: (data: Partial<DrinkType>) => void
}

export function DrinkDetails({ initialData, onSave }: DrinkDetailsProps) {
  const [date, setDate] = useState<Date>(new Date())
  const [time, setTime] = useState(format(new Date(), "HH:mm"))
  const [quantity, setQuantity] = useState("1")
  const [unit, setUnit] = useState("oz")
  const [abv, setAbv] = useState(initialData?.abv || 5)
  const [location, setLocation] = useState("")
  const [notes, setNotes] = useState("")

  const handleSave = () => {
    // Combine date and time
    const timestamp = new Date(date)
    const [hours, minutes] = time.split(":").map(Number)
    timestamp.setHours(hours, minutes)

    onSave({
      quantity: {
        amount: Number.parseFloat(quantity),
        unit,
      },
      abv,
      timestamp: timestamp.toISOString(),
      location,
      notes,
    })
  }

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h2 className="text-2xl font-bold">Drink Details</h2>
        <p className="text-muted-foreground">
          {initialData?.name ? `Adding details for ${initialData.name}` : "Add details for your drink"}
        </p>
      </div>

      <div className="grid gap-6">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="quantity">Quantity</Label>
            <div className="flex gap-2">
              <Input
                id="quantity"
                type="number"
                min="0"
                step="0.1"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
              />
              <Select value={unit} onValueChange={setUnit}>
                <SelectTrigger className="w-24">
                  <SelectValue placeholder="Unit" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="oz">oz</SelectItem>
                  <SelectItem value="ml">ml</SelectItem>
                  <SelectItem value="glass">glass</SelectItem>
                  <SelectItem value="bottle">bottle</SelectItem>
                  <SelectItem value="can">can</SelectItem>
                  <SelectItem value="pint">pint</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="abv">ABV ({abv}%)</Label>
            <Slider id="abv" min={0} max={70} step={0.5} value={[abv]} onValueChange={(values) => setAbv(values[0])} />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="w-full justify-start text-left font-normal">
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date ? format(date, "PPP") : "Pick a date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar mode="single" selected={date} onSelect={(date) => date && setDate(date)} initialFocus />
              </PopoverContent>
            </Popover>
          </div>

          <div className="space-y-2">
            <Label htmlFor="time">Time</Label>
            <div className="flex items-center">
              <Clock className="mr-2 h-4 w-4 text-muted-foreground" />
              <Input id="time" type="time" value={time} onChange={(e) => setTime(e.target.value)} />
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="location">Location (Optional)</Label>
          <Input
            id="location"
            placeholder="Where did you have this drink?"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="notes">Notes (Optional)</Label>
          <Textarea
            id="notes"
            placeholder="Add any notes about this drink..."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={3}
          />
        </div>
      </div>

      <Button onClick={handleSave} className="w-full">
        Continue
      </Button>
    </div>
  )
}
