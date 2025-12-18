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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useWeb3 } from "@/contexts/web3-context"
import { Plus, X } from "lucide-react"

const CATEGORIES = ["Audit", "Development", "Consulting", "Integration"]

export default function NewServicePage() {
  const router = useRouter()
  const { isConnected, account } = useWeb3()
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [category, setCategory] = useState("")
  const [price, setPrice] = useState("")
  const [duration, setDuration] = useState("")
  const [stack, setStack] = useState<string[]>([])
  const [stackInput, setStackInput] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  if (!isConnected) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <div className="container mx-auto px-4 py-16">
          <Card className="mx-auto max-w-md p-8 text-center">
            <h2 className="text-2xl font-bold">Connect Your Wallet</h2>
            <p className="mt-2 text-muted-foreground">You need to connect your wallet to list a service</p>
          </Card>
        </div>
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
      await new Promise((resolve) => setTimeout(resolve, 2000))

      console.log("[v0] Service listed:", {
        title,
        description,
        category,
        price,
        duration,
        stack,
        provider: account,
      })

      router.push("/services")
    } catch (error) {
      console.error("Failed to list service:", error)
      alert("Failed to list service. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen">
      <Navbar />

      <div className="container mx-auto px-4 py-8">
        <div className="mx-auto max-w-3xl">
          <div className="mb-8">
            <h1 className="text-4xl font-bold">List New Service</h1>
            <p className="mt-2 text-muted-foreground">Offer your Web3 development services to the community</p>
          </div>

          <Card className="p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="title">Service Title *</Label>
                <Input
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Smart Contract Security Audit"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description *</Label>
                <Textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe what you offer, your expertise, and what's included..."
                  rows={6}
                  required
                />
              </div>

              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="category">Category *</Label>
                  <Select value={category} onValueChange={setCategory} required>
                    <SelectTrigger id="category">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {CATEGORIES.map((cat) => (
                        <SelectItem key={cat} value={cat}>
                          {cat}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="price">Price (ARC) *</Label>
                  <Input
                    id="price"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    placeholder="2.5"
                    type="number"
                    step="0.1"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="duration">Duration *</Label>
                <Input
                  id="duration"
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                  placeholder="1-2 weeks"
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
                    placeholder="e.g., Solidity, Hardhat, Slither"
                  />
                  <Button type="button" onClick={addStack} variant="outline">
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                {stack.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {stack.map((tech) => (
                      <Badge key={tech} variant="outline" className="gap-1">
                        {tech}
                        <button type="button" onClick={() => removeStack(tech)} className="ml-1">
                          <X className="h-3 w-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex gap-4 pt-4">
                <Button type="submit" disabled={isSubmitting} className="flex-1">
                  {isSubmitting ? "Listing Service..." : "List Service"}
                </Button>
                <Button type="button" variant="outline" onClick={() => router.back()}>
                  Cancel
                </Button>
              </div>
            </form>
          </Card>
        </div>
      </div>
    </div>
  )
}
