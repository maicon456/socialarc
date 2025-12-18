"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Navbar } from "@/components/navbar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useWeb3 } from "@/contexts/web3-context"
import { Plus, X } from "lucide-react"
import { Footer } from "@/components/footer"

export default function ProfilePage() {
  const router = useRouter()
  const { isConnected, account } = useWeb3()
  const [name, setName] = useState("")
  const [bio, setBio] = useState("")
  const [github, setGithub] = useState("")
  const [twitter, setTwitter] = useState("")
  const [website, setWebsite] = useState("")
  const [stack, setStack] = useState<string[]>([])
  const [stackInput, setStackInput] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  if (!isConnected) {
    return (
      <div className="flex min-h-screen flex-col">
        <Navbar />
        <div className="container mx-auto flex-1 px-4 py-16">
          <Card className="mx-auto max-w-md p-8 text-center">
            <h2 className="text-2xl font-bold">Connect Your Wallet</h2>
            <p className="mt-2 text-muted-foreground">You need to connect your wallet to create a profile</p>
          </Card>
        </div>
        <Footer />
      </div>
    )
  }

  const addStack = () => {
    if (stackInput.trim() && !stack.includes(stackInput.trim())) {
      setStack([...stack, stackInput.trim()])
      setStackInput("")
    }
  }

  const removeStack = (tech: string) => {
    setStack(stack.filter((t) => t !== tech))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      // Simulate IPFS upload and blockchain transaction
      await new Promise((resolve) => setTimeout(resolve, 2000))

      console.log("[v0] Profile created:", {
        name,
        bio,
        stack,
        socialLinks: { github, twitter, website },
        address: account,
      })

      router.push(`/developers/${account}`)
    } catch (error) {
      console.error("Failed to create profile:", error)
      alert("Failed to create profile. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />

      <div className="container mx-auto flex-1 px-4 py-8">
        <div className="mx-auto max-w-2xl">
          <div className="mb-8">
            <h1 className="text-4xl font-bold">Create Your Profile</h1>
            <p className="mt-2 text-muted-foreground">Set up your developer profile to start contributing</p>
          </div>

          <Card className="p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="name">Display Name *</Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="John Doe"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="bio">Bio *</Label>
                <Textarea
                  id="bio"
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder="Tell us about yourself and your Web3 experience..."
                  rows={4}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="stack">Tech Stack</Label>
                <div className="flex gap-2">
                  <Input
                    id="stack"
                    value={stackInput}
                    onChange={(e) => setStackInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addStack())}
                    placeholder="e.g., Solidity, React, Rust"
                  />
                  <Button type="button" onClick={addStack} variant="outline">
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                {stack.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {stack.map((tech) => (
                      <Badge key={tech} variant="secondary" className="gap-1">
                        {tech}
                        <button type="button" onClick={() => removeStack(tech)} className="ml-1">
                          <X className="h-3 w-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                )}
              </div>

              <div className="space-y-4 border-t border-border pt-6">
                <h3 className="font-semibold">Social Links</h3>

                <div className="space-y-2">
                  <Label htmlFor="github">GitHub</Label>
                  <Input
                    id="github"
                    type="url"
                    value={github}
                    onChange={(e) => setGithub(e.target.value)}
                    placeholder="https://github.com/username"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="twitter">Twitter</Label>
                  <Input
                    id="twitter"
                    type="url"
                    value={twitter}
                    onChange={(e) => setTwitter(e.target.value)}
                    placeholder="https://twitter.com/username"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="website">Website</Label>
                  <Input
                    id="website"
                    type="url"
                    value={website}
                    onChange={(e) => setWebsite(e.target.value)}
                    placeholder="https://yourwebsite.com"
                  />
                </div>
              </div>

              <div className="flex gap-4 pt-4">
                <Button type="submit" disabled={isSubmitting} className="flex-1">
                  {isSubmitting ? "Creating Profile..." : "Create Profile"}
                </Button>
                <Button type="button" variant="outline" onClick={() => router.back()}>
                  Cancel
                </Button>
              </div>
            </form>
          </Card>
        </div>
      </div>
      <Footer />
    </div>
  )
}
