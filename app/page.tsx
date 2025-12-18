import { Navbar } from "@/components/navbar"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Shield, Zap, Lock, Globe, Hash, Users } from "lucide-react"
import Link from "next/link"
import { Footer } from "@/components/footer"

export default function HomePage() {
  return (
    <div className="min-h-screen">
      <Navbar />

      <section className="container mx-auto px-4 py-20 md:py-32">
        <div className="mx-auto max-w-4xl text-center">
          <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-4 py-2 text-sm">
            <Zap className="h-4 w-4 text-primary" />
            <span>Powered by Arc Network</span>
          </div>

          <h1 className="text-balance text-5xl font-bold tracking-tight md:text-7xl">
            <span className="gradient-text">Decentralized Communication</span>
            <br />
            Built for Freedom
          </h1>

          <p className="mt-6 text-balance text-lg leading-relaxed text-muted-foreground md:text-xl">
            Censorship-resistant social platform where you own your identity and data. Connect through Nostr relays,
            secure your profile on Arc blockchain, and communicate without intermediaries.
          </p>

          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <Button size="lg" asChild className="gap-2">
              <Link href="/feed">
                <Hash className="h-5 w-5" />
                Enter Feed
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/relays">View Relays</Link>
            </Button>
          </div>
        </div>
      </section>

      <section className="border-y border-border bg-card/30">
        <div className="container mx-auto px-4 py-16">
          <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
            <div className="text-center">
              <div className="text-4xl font-bold text-primary">100%</div>
              <div className="mt-2 text-sm text-muted-foreground">Censorship Resistant</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-primary">∞</div>
              <div className="mt-2 text-sm text-muted-foreground">Relay Options</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-primary">0</div>
              <div className="mt-2 text-sm text-muted-foreground">Central Authority</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-primary">24/7</div>
              <div className="mt-2 text-sm text-muted-foreground">Always Available</div>
            </div>
          </div>
        </div>
      </section>

      <section className="container mx-auto px-4 py-20">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          <Card className="glass-card p-6">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
              <Shield className="h-6 w-6 text-primary" />
            </div>
            <h3 className="mt-4 text-xl font-bold">User Sovereignty</h3>
            <p className="mt-2 leading-relaxed text-muted-foreground">
              You control your identity with cryptographic keys. No company owns your account or can ban you.
            </p>
          </Card>

          <Card className="glass-card p-6">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
              <Lock className="h-6 w-6 text-primary" />
            </div>
            <h3 className="mt-4 text-xl font-bold">End-to-End Encryption</h3>
            <p className="mt-2 leading-relaxed text-muted-foreground">
              Direct messages are encrypted client-side. Only you and your recipient can read them.
            </p>
          </Card>

          <Card className="glass-card p-6">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
              <Globe className="h-6 w-6 text-primary" />
            </div>
            <h3 className="mt-4 text-xl font-bold">Distributed Relays</h3>
            <p className="mt-2 leading-relaxed text-muted-foreground">
              Messages distributed across independent relay nodes. No single point of failure or control.
            </p>
          </Card>

          <Card className="glass-card p-6">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
              <Zap className="h-6 w-6 text-primary" />
            </div>
            <h3 className="mt-4 text-xl font-bold">Arc Integration</h3>
            <p className="mt-2 leading-relaxed text-muted-foreground">
              Register identities on-chain with USDC gas fees. Verifiable profiles with sub-second finality.
            </p>
          </Card>

          <Card className="glass-card p-6">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
              <Hash className="h-6 w-6 text-primary" />
            </div>
            <h3 className="mt-4 text-xl font-bold">Nostr Protocol</h3>
            <p className="mt-2 leading-relaxed text-muted-foreground">
              Built on open protocol. Your identity works across all Nostr-compatible apps and services.
            </p>
          </Card>

          <Card className="glass-card p-6">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
              <Users className="h-6 w-6 text-primary" />
            </div>
            <h3 className="mt-4 text-xl font-bold">Community Driven</h3>
            <p className="mt-2 leading-relaxed text-muted-foreground">
              No corporate control. Governed by users and developers building the future of social.
            </p>
          </Card>
        </div>
      </section>

      <section className="border-t border-border bg-primary/5">
        <div className="container mx-auto px-4 py-20">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="text-balance text-3xl font-bold md:text-5xl">Ready to reclaim your digital freedom?</h2>
            <p className="mt-4 text-balance leading-relaxed text-muted-foreground">
              Join the decentralized social revolution. No account creation, no data harvesting, no censorship.
            </p>
            <div className="mt-8">
              <Button size="lg" asChild className="gap-2">
                <Link href="/feed">
                  <Hash className="h-5 w-5" />
                  Start Now
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
