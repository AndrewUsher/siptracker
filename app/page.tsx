import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { LogDrinkForm } from "@/components/log-drink-form"
import { DrinkHistory } from "@/components/drink-history"
import { ModeToggle } from "@/components/mode-toggle"
import { Beer, History } from "lucide-react"

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="container flex h-16 items-center justify-between px-4 md:px-6">
          <div className="flex items-center gap-2">
            <Beer className="h-6 w-6" />
            <h1 className="text-xl font-bold">SipTracker</h1>
          </div>
          <ModeToggle />
        </div>
      </header>
      <main className="container mx-auto px-4 py-6 md:px-6 md:py-10">
        <Tabs defaultValue="log" className="w-full max-w-3xl mx-auto">
          <TabsList className="grid w-full grid-cols-2 mb-8">
            <TabsTrigger value="log" className="flex items-center gap-2">
              <Beer className="h-4 w-4" />
              Log Drink
            </TabsTrigger>
            <TabsTrigger value="history" className="flex items-center gap-2">
              <History className="h-4 w-4" />
              History
            </TabsTrigger>
          </TabsList>
          <TabsContent value="log" className="space-y-4">
            <LogDrinkForm />
          </TabsContent>
          <TabsContent value="history">
            <DrinkHistory />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
