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
import { Upload, X, Plus } from "lucide-react"

export default function NewProjectPage() {
  const router = useRouter()
  const { isConnected, account } = useWeb3()
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [githubUrl, setGithubUrl] = useState("")
  const [stack, setStack] = useState<string[]>([])
  const [stackInput, setStackInput] = useState("")
  const [tags, setTags] = useState<string[]>([])
  const [tagInput, setTagInput] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  if (!isConnected) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <div className="container mx-auto px-4 py-16">
          <Card className="mx-auto max-w-md p-8 text-center">
            <h2 className="text-2xl font-bold">Connect Your Wallet</h2>
            <p className="mt-2 text-muted-foreground">You need to connect your wallet to publish a project</p>
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

  const addTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim().toLowerCase())) {
      setTags([...tags, tagInput.trim().toLowerCase()])
      setTagInput("")
    }
  }

  const removeTag = (tag: string) => {
    setTags(tags.filter((t) => t !== tag))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      // Simulate IPFS upload and blockchain transaction
      await new Promise((resolve) => setTimeout(resolve, 2000))

      console.log("[v0] Project submitted:", {
        title,
        description,
        githubUrl,
        stack,
        tags,
        author: account,
      })

      router.push("/projects")
    } catch (error) {
      console.error("Failed to publish project:", error)
      alert("Failed to publish project. Please try again.")
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
            <h1 className="text-4xl font-bold">Publish New Project</h1>
            <p className="mt-2 text-muted-foreground">Share your Web3 project with the Arcnet developer community</p>
          </div>

          <Card className="p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="title">Project Title *</Label>
                <Input
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="DeFi Lending Protocol"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description *</Label>
                <Textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe your project, its features, and what makes it unique..."
                  rows={6}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="github">GitHub URL *</Label>
                <Input
                  id="github"
                  type="url"
                  value={githubUrl}
                  onChange={(e) => setGithubUrl(e.target.value)}
                  placeholder="https://github.com/username/project"
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
                    placeholder="e.g., Solidity, React, Ethers.js"
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

              <div className="space-y-2">
                <Label htmlFor="tags">Tags</Label>
                <div className="flex gap-2">
                  <Input
                    id="tags"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addTag())}
                    placeholder="e.g., defi, nft, dao"
                  />
                  <Button type="button" onClick={addTag} variant="outline">
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                {tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {tags.map((tag) => (
                      <Badge key={tag} variant="secondary" className="gap-1">
                        #{tag}
                        <button type="button" onClick={() => removeTag(tag)} className="ml-1">
                          <X className="h-3 w-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <Label>Project Image (optional)</Label>
                <div className="flex items-center justify-center rounded-lg border-2 border-dashed border-border p-8 text-center">
                  <div>
                    <Upload className="mx-auto h-8 w-8 text-muted-foreground" />
                    <p className="mt-2 text-sm text-muted-foreground">Upload an image or leave blank for default</p>
                    <p className="mt-1 text-xs text-muted-foreground">PNG, JPG up to 5MB</p>
                  </div>
                </div>
              </div>

              <div className="flex gap-4 pt-4">
                <Button type="submit" disabled={isSubmitting} className="flex-1">
                  {isSubmitting ? "Publishing to IPFS & Arcnet..." : "Publish Project"}
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
