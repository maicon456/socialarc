"use client"

import type React from "react"
import { useState, useRef } from "react"
import { useRouter } from "next/navigation"
import { Navbar } from "@/components/navbar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useWeb3 } from "@/contexts/web3-context"
import { useToast } from "@/hooks/use-toast"
import { createProfileOnChain } from "@/lib/profile-onchain"
import { getTransactionExplorerUrl, formatTransactionHash } from "@/lib/blockchain-interactions"
import { Plus, X, Upload, Loader2, ExternalLink, ImageIcon } from "lucide-react"
import { Footer } from "@/components/footer"

export default function ProfilePage() {
  const router = useRouter()
  const { isConnected, account } = useWeb3()
  const { toast } = useToast()
  const [name, setName] = useState("")
  const [bio, setBio] = useState("")
  const [github, setGithub] = useState("")
  const [twitter, setTwitter] = useState("")
  const [website, setWebsite] = useState("")
  const [stack, setStack] = useState<string[]>([])
  const [stackInput, setStackInput] = useState("")
  const [avatarFile, setAvatarFile] = useState<File | null>(null)
  const [avatarPreview, setAvatarPreview] = useState<string>("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const avatarInputRef = useRef<HTMLInputElement>(null)

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

  const handleAvatarSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        toast({
          title: "Invalid file type",
          description: "Please select an image file",
          variant: "destructive",
        })
        return
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: "File too large",
          description: "Please select an image smaller than 5MB",
          variant: "destructive",
        })
        return
      }

      setAvatarFile(file)
      
      // Create preview
      const reader = new FileReader()
      reader.onloadend = () => {
        setAvatarPreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const removeAvatar = () => {
    setAvatarFile(null)
    setAvatarPreview("")
    if (avatarInputRef.current) {
      avatarInputRef.current.value = ""
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!isConnected || !account) {
      toast({
        title: "Wallet not connected",
        description: "Please connect your wallet to create a profile",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)

    try {
      toast({
        title: "Creating profile on-chain",
        description: "This will create a transaction on Arc Network (~0.01 USDC)",
      })

      const { txHash } = await createProfileOnChain(
        name,
        bio,
        avatarFile,
        github || undefined,
        twitter || undefined,
        website || undefined,
        stack
      )

      toast({
        title: "Profile created successfully!",
        description: (
          <div className="space-y-1">
            <p>Your profile has been saved on-chain</p>
            <a
              href={getTransactionExplorerUrl(txHash)}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-primary underline text-sm"
            >
              View transaction {formatTransactionHash(txHash)} <ExternalLink className="h-3 w-3" />
            </a>
          </div>
        ),
      })

      // Redirect to profile view
      setTimeout(() => {
        router.push(`/developers/${account}`)
      }, 2000)
    } catch (error: any) {
      console.error("Failed to create profile:", error)
      toast({
        title: "Failed to create profile",
        description: error.message || "An error occurred while creating your profile",
        variant: "destructive",
      })
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
              {/* Avatar Upload */}
              <div className="space-y-2">
                <Label>Profile Picture</Label>
                <div className="flex items-center gap-4">
                  <Avatar className="h-24 w-24">
                    <AvatarImage src={avatarPreview || `https://api.dicebear.com/7.x/shapes/svg?seed=${account}`} />
                    <AvatarFallback className="text-2xl">
                      {name ? name.slice(0, 2).toUpperCase() : account?.slice(0, 2).toUpperCase() || "U"}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 space-y-2">
                    <input
                      ref={avatarInputRef}
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleAvatarSelect}
                      disabled={isSubmitting}
                    />
                    <div className="flex gap-2">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => avatarInputRef.current?.click()}
                        disabled={isSubmitting}
                        className="gap-2"
                      >
                        <ImageIcon className="h-4 w-4" />
                        {avatarFile ? "Change Photo" : "Upload Photo"}
                      </Button>
                      {avatarFile && (
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={removeAvatar}
                          disabled={isSubmitting}
                          className="gap-2"
                        >
                          <X className="h-4 w-4" />
                          Remove
                        </Button>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      JPG, PNG or GIF. Max 5MB. Your avatar will be stored on-chain.
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="name">Display Name *</Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="John Doe"
                  required
                  disabled={isSubmitting}
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
                  disabled={isSubmitting}
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
                <Button type="submit" disabled={isSubmitting} className="flex-1 gap-2">
                  {isSubmitting ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Creating Profile on-chain...
                    </>
                  ) : (
                    "Create Profile on-chain"
                  )}
                </Button>
                <Button type="button" variant="outline" onClick={() => router.back()} disabled={isSubmitting}>
                  Cancel
                </Button>
              </div>
              
              {isSubmitting && (
                <div className="rounded-lg border border-primary/20 bg-primary/5 p-4">
                  <p className="text-sm text-muted-foreground">
                    ⏳ Creating transaction on Arc Network. This will cost ~0.01 USDC in gas fees.
                  </p>
                </div>
              )}
            </form>
          </Card>
        </div>
      </div>
      <Footer />
    </div>
  )
}
