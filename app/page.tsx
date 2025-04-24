import Link from 'next/link'
import { Button } from "@/components/ui/button"
import { ModeToggle } from "@/components/mode-toggle"

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="fixed top-0 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto flex h-14 items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="text-xl font-bold">SipTracker</span>
          </div>
          <div className="flex items-center space-x-4">
            <ModeToggle />
            <Link href="/dashboard">
              <Button>Get Started</Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="container mx-auto flex min-h-screen flex-col items-center justify-center space-y-8 pt-24 text-center">
        <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl">
          Track Your Drinks,<br />
          <span className="text-primary">Sip by Sip</span>
        </h1>
        <p className="max-w-[600px] text-muted-foreground md:text-xl">
          A modern way to log and track your drinks. Search from thousands of cocktails,
          log your favorites, and keep track of your drinking habits.
        </p>
        <div className="flex space-x-4">
          <Link href="/dashboard">
            <Button size="lg">Start Tracking</Button>
          </Link>
          <Link href="#features">
            <Button size="lg" variant="outline">Learn More</Button>
          </Link>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="container mx-auto space-y-12 py-24">
        <h2 className="text-center text-3xl font-bold">Features</h2>
        <div className="grid gap-8 md:grid-cols-3">
          {/* Feature 1 */}
          <div className="rounded-lg border p-6">
            <h3 className="mb-2 text-xl font-semibold">Smart Drink Logging</h3>
            <p className="text-muted-foreground">
              Search from thousands of drinks in TheCocktailDB database or add your own custom drinks.
            </p>
          </div>
          
          {/* Feature 2 */}
          <div className="rounded-lg border p-6">
            <h3 className="mb-2 text-xl font-semibold">Detailed Tracking</h3>
            <p className="text-muted-foreground">
              Log quantity, ABV, and add notes to each drink entry. Keep track of when and where you enjoyed your drinks.
            </p>
          </div>
          
          {/* Feature 3 */}
          <div className="rounded-lg border p-6">
            <h3 className="mb-2 text-xl font-semibold">Insightful Analytics</h3>
            <p className="text-muted-foreground">
              View your drinking history, track patterns, and get insights into your consumption habits.
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto space-y-8 py-24 text-center">
        <h2 className="text-3xl font-bold">Ready to Start Tracking?</h2>
        <p className="mx-auto max-w-[600px] text-muted-foreground">
          Join thousands of users who are already tracking their drinks with SipTracker.
        </p>
        <Link href="/dashboard">
          <Button size="lg">Get Started Now</Button>
        </Link>
      </section>

      {/* Footer */}
      <footer className="border-t py-6">
        <div className="container mx-auto flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            © 2024 SipTracker. All rights reserved.
          </p>
          <div className="flex space-x-4">
            <Link href="/privacy" className="text-sm text-muted-foreground hover:text-foreground">
              Privacy
            </Link>
            <Link href="/terms" className="text-sm text-muted-foreground hover:text-foreground">
              Terms
            </Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
