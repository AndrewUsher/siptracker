"use client"

import { useState } from "react"
import { format } from "date-fns"
import { Beer, Calendar, Filter, Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import type { DrinkType } from "@/types/drink"

// Mock data - in a real app, this would come from a database
const MOCK_HISTORY: (DrinkType & { timestamp: string })[] = [
  {
    id: "log1",
    name: "Margarita",
    category: "Cocktail",
    abv: 12.5,
    imageUrl: "/placeholder.svg?height=100&width=100",
    quantity: { amount: 2, unit: "oz" },
    timestamp: "2023-06-15T20:30:00Z",
    location: "Home",
  },
  {
    id: "log2",
    name: "Heineken",
    category: "Beer",
    abv: 5,
    imageUrl: "/placeholder.svg?height=100&width=100",
    quantity: { amount: 1, unit: "bottle" },
    timestamp: "2023-06-14T19:15:00Z",
    location: "Bar",
  },
  {
    id: "log3",
    name: "Cabernet Sauvignon",
    category: "Wine",
    abv: 13.5,
    imageUrl: "/placeholder.svg?height=100&width=100",
    quantity: { amount: 6, unit: "oz" },
    timestamp: "2023-06-13T21:00:00Z",
    location: "Restaurant",
  },
]

export function DrinkHistory() {
  const [searchTerm, setSearchTerm] = useState("")
  const [filter, setFilter] = useState("all")

  const filteredHistory = MOCK_HISTORY.filter((item) => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesFilter = filter === "all" || item.category.toLowerCase() === filter.toLowerCase()
    return matchesSearch && matchesFilter
  })

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4 justify-between">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search drink history..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex gap-2">
          <Select value={filter} onValueChange={setFilter}>
            <SelectTrigger className="w-[180px]">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Filter by type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="cocktail">Cocktails</SelectItem>
              <SelectItem value="beer">Beer</SelectItem>
              <SelectItem value="wine">Wine</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            <span className="hidden sm:inline">Date Range</span>
          </Button>
        </div>
      </div>

      {filteredHistory.length > 0 ? (
        <div className="space-y-4">
          {filteredHistory.map((item) => (
            <Card key={item.id} className="overflow-hidden">
              <div className="flex">
                <div className="w-20 h-20 bg-muted flex items-center justify-center">
                  <img
                    src={item.imageUrl || "/placeholder.svg"}
                    alt={item.name}
                    className="object-cover w-full h-full"
                  />
                </div>
                <div className="flex-1 p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-medium">{item.name}</h3>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="outline">{item.category}</Badge>
                        <span className="text-xs text-muted-foreground">
                          {format(new Date(item.timestamp), "MMM d, yyyy 'at' h:mm a")}
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-medium">
                        {item.quantity?.amount} {item.quantity?.unit}
                      </div>
                      <div className="text-xs">{item.abv}% ABV</div>
                    </div>
                  </div>

                  {item.location && <div className="mt-2 text-sm text-muted-foreground">Location: {item.location}</div>}
                </div>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 border rounded-lg">
          <Beer className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium mb-2">No drinks found</h3>
          <p className="text-muted-foreground mb-4">
            {searchTerm || filter !== "all"
              ? "Try adjusting your search or filters"
              : "You haven't logged any drinks yet"}
          </p>
          <Button>Log Your First Drink</Button>
        </div>
      )}
    </div>
  )
}
