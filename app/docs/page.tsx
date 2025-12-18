import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ExternalLink, Code, Zap, Shield, Globe, Coins, ArrowRight, Twitter, Github, MessageCircle } from "lucide-react"
import { ARC_LINKS } from "@/lib/web3-config"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"

export default function DocsPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />

      <div className="flex-1 bg-gradient-to-b from-background via-background to-primary/5">
        <div className="container mx-auto px-4 py-12">
          {/* Header */}
          <div className="mb-12 text-center">
            <h1 className="mb-4 bg-gradient-to-r from-primary via-purple-500 to-blue-500 bg-clip-text text-5xl font-bold text-transparent">
              Arc Network Documentation
            </h1>
            <p className="mx-auto max-w-2xl text-balance text-lg text-muted-foreground">
              An open Layer-1 blockchain purpose-built to unite programmable money and onchain innovation with
              real-world economic activity
            </p>
          </div>

          {/* Quick Links */}
          <div className="mb-12 grid gap-4 md:grid-cols-3">
            <Card className="border-primary/20 bg-card/50 backdrop-blur transition-all hover:border-primary/40">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Globe className="h-5 w-5 text-primary" />
                  Explorer
                </CardTitle>
                <CardDescription>View transactions and blocks</CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="outline" className="w-full bg-transparent" asChild>
                  <a href={ARC_LINKS.explorer} target="_blank" rel="noopener noreferrer">
                    Open Explorer
                    <ExternalLink className="ml-2 h-4 w-4" />
                  </a>
                </Button>
              </CardContent>
            </Card>

            <Card className="border-primary/20 bg-card/50 backdrop-blur transition-all hover:border-primary/40">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Coins className="h-5 w-5 text-primary" />
                  Faucet
                </CardTitle>
                <CardDescription>Get testnet USDC for gas</CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="outline" className="w-full bg-transparent" asChild>
                  <a href={ARC_LINKS.faucet} target="_blank" rel="noopener noreferrer">
                    Request USDC
                    <ExternalLink className="ml-2 h-4 w-4" />
                  </a>
                </Button>
              </CardContent>
            </Card>

            <Card className="border-primary/20 bg-card/50 backdrop-blur transition-all hover:border-primary/40">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Code className="h-5 w-5 text-primary" />
                  Full Docs
                </CardTitle>
                <CardDescription>Complete technical documentation</CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="outline" className="w-full bg-transparent" asChild>
                  <a href={ARC_LINKS.docs} target="_blank" rel="noopener noreferrer">
                    Read Docs
                    <ExternalLink className="ml-2 h-4 w-4" />
                  </a>
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Network Details */}
          <Card className="mb-8 border-primary/20 bg-card/50 backdrop-blur">
            <CardHeader>
              <CardTitle>Network Configuration</CardTitle>
              <CardDescription>Connect your wallet to Arc Testnet</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <div className="flex items-center justify-between rounded-lg border border-border/50 p-3">
                    <span className="text-sm font-medium text-muted-foreground">Network Name</span>
                    <span className="font-mono text-sm">Arc Testnet</span>
                  </div>
                  <div className="flex items-center justify-between rounded-lg border border-border/50 p-3">
                    <span className="text-sm font-medium text-muted-foreground">Chain ID</span>
                    <span className="font-mono text-sm">5042002</span>
                  </div>
                  <div className="flex items-center justify-between rounded-lg border border-border/50 p-3">
                    <span className="text-sm font-medium text-muted-foreground">Currency</span>
                    <span className="font-mono text-sm">USDC</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between rounded-lg border border-border/50 p-3">
                    <span className="text-sm font-medium text-muted-foreground">RPC URL</span>
                    <span className="truncate font-mono text-xs">{ARC_LINKS.rpc}</span>
                  </div>
                  <div className="flex items-center justify-between rounded-lg border border-border/50 p-3">
                    <span className="text-sm font-medium text-muted-foreground">Explorer</span>
                    <span className="truncate font-mono text-xs">testnet.arcscan.app</span>
                  </div>
                  <div className="flex items-center justify-between rounded-lg border border-border/50 p-3">
                    <span className="text-sm font-medium text-muted-foreground">WebSocket</span>
                    <span className="truncate font-mono text-xs">wss://rpc.testnet.arc.network</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Key Features */}
          <div className="mb-8">
            <h2 className="mb-6 text-3xl font-bold">Key Features</h2>
            <div className="grid gap-6 md:grid-cols-3">
              <Card className="border-primary/20 bg-card/50 backdrop-blur">
                <CardHeader>
                  <Zap className="mb-2 h-8 w-8 text-primary" />
                  <CardTitle>Stable Fee Design</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Predictable fiat-based fees using USDC as the native gas token, enabling transparent and stable
                    transaction costs.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-primary/20 bg-card/50 backdrop-blur">
                <CardHeader>
                  <Shield className="mb-2 h-8 w-8 text-primary" />
                  <CardTitle>Deterministic Finality</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Sub-second finality with Malachite BFT consensus, providing certainty and reliability for
                    enterprise-grade applications.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-primary/20 bg-card/50 backdrop-blur">
                <CardHeader>
                  <Globe className="mb-2 h-8 w-8 text-primary" />
                  <CardTitle>EVM Compatible</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Full EVM compatibility allows developers to deploy smart contracts using familiar tools and
                    languages like Solidity.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* What You Can Build */}
          <Card className="border-primary/20 bg-card/50 backdrop-blur">
            <CardHeader>
              <CardTitle className="text-2xl">What You Can Build on Arc</CardTitle>
              <CardDescription>
                Arc focuses on real-world economic activity and institutional-grade DeFi
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex gap-3 rounded-lg border border-border/50 p-4">
                  <ArrowRight className="mt-1 h-5 w-5 flex-shrink-0 text-primary" />
                  <div>
                    <h4 className="mb-1 font-semibold">Onchain Credit & Lending</h4>
                    <p className="text-sm text-muted-foreground">
                      Build identity-based lending protocols, reputation-driven credit systems, and SMB credit apps
                    </p>
                  </div>
                </div>

                <div className="flex gap-3 rounded-lg border border-border/50 p-4">
                  <ArrowRight className="mt-1 h-5 w-5 flex-shrink-0 text-primary" />
                  <div>
                    <h4 className="mb-1 font-semibold">Capital Markets & Tokenization</h4>
                    <p className="text-sm text-muted-foreground">
                      Create tokenized securities platforms, collateral management, and structured products
                    </p>
                  </div>
                </div>

                <div className="flex gap-3 rounded-lg border border-border/50 p-4">
                  <ArrowRight className="mt-1 h-5 w-5 flex-shrink-0 text-primary" />
                  <div>
                    <h4 className="mb-1 font-semibold">Stablecoin FX & Swaps</h4>
                    <p className="text-sm text-muted-foreground">
                      Build perpetuals exchanges, swap APIs, and multi-currency treasury tools
                    </p>
                  </div>
                </div>

                <div className="flex gap-3 rounded-lg border border-border/50 p-4">
                  <ArrowRight className="mt-1 h-5 w-5 flex-shrink-0 text-primary" />
                  <div>
                    <h4 className="mb-1 font-semibold">Cross-Border Payments</h4>
                    <p className="text-sm text-muted-foreground">
                      Power remittance platforms, global payouts, and trade finance with instant settlement
                    </p>
                  </div>
                </div>

                <div className="flex gap-3 rounded-lg border border-border/50 p-4">
                  <ArrowRight className="mt-1 h-5 w-5 flex-shrink-0 text-primary" />
                  <div>
                    <h4 className="mb-1 font-semibold">Agentic Commerce</h4>
                    <p className="text-sm text-muted-foreground">
                      Enable AI-mediated marketplaces and machine-to-machine payment networks
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Social Media & Community */}
          <Card className="mb-8 border-primary/20 bg-card/50 backdrop-blur">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="h-5 w-5 text-primary" />
                Connect with Arc Network
              </CardTitle>
              <CardDescription>Join the community and stay updated</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
                <a
                  href={ARC_LINKS.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 rounded-lg border border-border/50 p-4 transition-all hover:border-primary/50 hover:bg-card"
                >
                  <Globe className="h-5 w-5 text-primary" />
                  <div className="flex-1">
                    <div className="font-semibold">Official Website</div>
                    <div className="text-sm text-muted-foreground">arc.network</div>
                  </div>
                  <ExternalLink className="h-4 w-4 text-muted-foreground" />
                </a>

                <a
                  href={ARC_LINKS.twitter}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 rounded-lg border border-border/50 p-4 transition-all hover:border-primary/50 hover:bg-card"
                >
                  <Twitter className="h-5 w-5 text-primary" />
                  <div className="flex-1">
                    <div className="font-semibold">Twitter / X</div>
                    <div className="text-sm text-muted-foreground">@arcnetwork</div>
                  </div>
                  <ExternalLink className="h-4 w-4 text-muted-foreground" />
                </a>

                <a
                  href={ARC_LINKS.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 rounded-lg border border-border/50 p-4 transition-all hover:border-primary/50 hover:bg-card"
                >
                  <Github className="h-5 w-5 text-primary" />
                  <div className="flex-1">
                    <div className="font-semibold">GitHub</div>
                    <div className="text-sm text-muted-foreground">Open source code</div>
                  </div>
                  <ExternalLink className="h-4 w-4 text-muted-foreground" />
                </a>

                <a
                  href={ARC_LINKS.discord}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 rounded-lg border border-border/50 p-4 transition-all hover:border-primary/50 hover:bg-card"
                >
                  <MessageCircle className="h-5 w-5 text-primary" />
                  <div className="flex-1">
                    <div className="font-semibold">Discord</div>
                    <div className="text-sm text-muted-foreground">Join the community</div>
                  </div>
                  <ExternalLink className="h-4 w-4 text-muted-foreground" />
                </a>
              </div>
            </CardContent>
          </Card>

          {/* Getting Started */}
          <div className="mt-12 text-center">
            <h2 className="mb-4 text-2xl font-bold">Ready to Start Building?</h2>
            <p className="mb-6 text-muted-foreground">
              Check out the official documentation for guides, tutorials, and API references
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button size="lg" asChild>
                <a href={`${ARC_LINKS.docs}/arc/tutorials/deploy-on-arc`} target="_blank" rel="noopener noreferrer">
                  Deploy Guide
                  <ExternalLink className="ml-2 h-4 w-4" />
                </a>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="/feed">
                  Explore DApp
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}
