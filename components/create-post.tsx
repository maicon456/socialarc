"use client"

import { useState, useRef } from "react"
import { Card } from "./ui/card"
import { Button } from "./ui/button"
import { Textarea } from "./ui/textarea"
import { useWeb3 } from "@/contexts/web3-context"
import { useToast } from "@/hooks/use-toast"
import { createPostOnChain, GAS_FEES } from "@/lib/blockchain-social"
import { getTransactionExplorerUrl, formatTransactionHash } from "@/lib/blockchain-interactions"
import { uploadMediaToStorage } from "@/lib/media-storage"
import { ImageIcon, Video, Loader2, Send, X, ExternalLink, Play } from "lucide-react"
import { ARC_LINKS } from "@/lib/web3-config"

export function CreatePost() {
  const [content, setContent] = useState("")
  const [isPublishing, setIsPublishing] = useState(false)
  const [mediaFiles, setMediaFiles] = useState<File[]>([])
  const [mediaPreviews, setMediaPreviews] = useState<string[]>([])
  const imageInputRef = useRef<HTMLInputElement>(null)
  const videoInputRef = useRef<HTMLInputElement>(null)
  const { account, isConnected } = useWeb3()
  const { toast } = useToast()

  function handleMediaSelect(files: FileList | null, type: "image" | "video") {
    if (!files || files.length === 0) return

    const newFiles = Array.from(files)
    setMediaFiles((prev) => [...prev, ...newFiles])

    // Create previews
    newFiles.forEach((file) => {
      const reader = new FileReader()
      reader.onloadend = () => {
        setMediaPreviews((prev) => [...prev, reader.result as string])
      }
      reader.readAsDataURL(file)
    })
  }

  function removeMedia(index: number) {
    setMediaFiles((prev) => prev.filter((_, i) => i !== index))
    setMediaPreviews((prev) => prev.filter((_, i) => i !== index))
  }

  async function handlePublish() {
    if (!content.trim() && mediaFiles.length === 0) {
      toast({
        title: "Empty post",
        description: "Please add some content or media to your post",
        variant: "destructive",
      })
      return
    }

    if (!isConnected || !account) {
      toast({
        title: "Wallet not connected",
        description: "Please connect your wallet to create posts",
        variant: "destructive",
      })
      return
    }

    setIsPublishing(true)

    try {
      // Upload media files first
      let mediaUrls: string[] = []
      
      if (mediaFiles.length > 0) {
        toast({
          title: "Uploading media...",
          description: "Storing photos/videos...",
        })
        
        try {
          mediaUrls = await uploadMediaToStorage(mediaFiles)
          console.log("[CreatePost] Media uploaded and saved permanently:", mediaUrls)
          console.log("[CreatePost] Photos/videos are now accessible to all users")
        } catch (error: any) {
          console.error("[CreatePost] Media upload failed:", error)
          toast({
            title: "Media upload failed",
            description: error.message || "Could not save media files. Please try again.",
            variant: "destructive",
          })
          setIsPublishing(false)
          return
        }
      }

      // Determine content type
      const contentType = mediaFiles.some((f) => f.type.startsWith("video"))
        ? "video"
        : mediaFiles.some((f) => f.type.startsWith("image"))
          ? "image"
          : mediaFiles.length > 0
            ? "mixed"
            : "text"

      toast({
        title: "Creating post on-chain",
        description: `Transaction fee: ~${GAS_FEES.createPost} USDC`,
      })

      const { postId, txHash } = await createPostOnChain(content, mediaUrls, contentType)

      toast({
        title: "Post created successfully!",
        description: (
          <div className="space-y-1">
            <p>Your post has been published on Arc Network</p>
            <p className="text-xs text-muted-foreground">Post ID: {postId}</p>
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

      // Refresh posts after creating - with a small delay to ensure transaction is mined
      setTimeout(() => {
        window.dispatchEvent(new Event('posts-refresh'))
      }, 2000) // Wait 2 seconds for transaction to be mined

      // Reset form
      setContent("")
      setMediaFiles([])
      setMediaPreviews([])
    } catch (error: any) {
      console.error("[v0] Failed to publish post:", error)
      toast({
        title: "Failed to create post",
        description: error.message || "An error occurred while creating your post",
        variant: "destructive",
      })
    } finally {
      setIsPublishing(false)
    }
  }

  if (!isConnected) {
    return (
      <Card className="p-6 text-center">
        <p className="text-muted-foreground">Connect your wallet to create posts on Arc Network</p>
      </Card>
    )
  }

  return (
    <Card className="p-4">
      <Textarea
        placeholder="What's on your mind?"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        className="min-h-[120px] resize-none border-0 focus-visible:ring-0"
        disabled={isPublishing}
      />

      {/* Media Previews - Twitter/X style */}
      {mediaPreviews.length > 0 && (
        <div className={`mt-3 grid gap-2 ${
          mediaPreviews.length === 1 
            ? 'grid-cols-1' 
            : mediaPreviews.length === 2 
              ? 'grid-cols-2' 
              : 'grid-cols-2'
        }`}>
          {mediaPreviews.map((preview, index) => {
            const isVideo = mediaFiles[index].type.startsWith("video")
            
            return (
              <div key={index} className="relative group">
                {isVideo ? (
                  <div className="relative h-60 w-full overflow-hidden rounded-xl bg-muted">
                    <video 
                      src={preview} 
                      className="h-full w-full object-cover" 
                      controls
                      preload="metadata"
                    />
                    <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                      <Play className="h-12 w-12 text-white opacity-80" />
                    </div>
                  </div>
                ) : (
                  <div className="relative h-60 w-full overflow-hidden rounded-xl">
                    <img
                      src={preview || "/placeholder.svg"}
                      alt="Preview"
                      className="h-full w-full object-cover"
                    />
                  </div>
                )}
                <Button
                  variant="destructive"
                  size="icon"
                  className="absolute right-2 top-2 h-8 w-8 opacity-90 hover:opacity-100"
                  onClick={() => removeMedia(index)}
                >
                  <X className="h-4 w-4" />
                </Button>
                {!isVideo && (
                  <div className="absolute bottom-2 left-2 bg-black/50 text-white text-xs px-2 py-1 rounded">
                    {mediaFiles[index].name}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}

      <div className="mt-3 flex items-center justify-between border-t pt-3">
        <div className="flex items-center gap-2">
          <input
            ref={imageInputRef}
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            onChange={(e) => handleMediaSelect(e.target.files, "image")}
          />
          <Button
            variant="ghost"
            size="sm"
            onClick={() => imageInputRef.current?.click()}
            disabled={isPublishing}
            className="gap-2"
          >
            <ImageIcon className="h-4 w-4 text-green-500" />
            Photo
          </Button>

          <input
            ref={videoInputRef}
            type="file"
            accept="video/*"
            className="hidden"
            onChange={(e) => handleMediaSelect(e.target.files, "video")}
          />
          <Button
            variant="ghost"
            size="sm"
            onClick={() => videoInputRef.current?.click()}
            disabled={isPublishing}
            className="gap-2"
          >
            <Video className="h-4 w-4 text-red-500" />
            Video
          </Button>

          <span className="ml-2 text-xs text-muted-foreground">Fee: {GAS_FEES.createPost} USDC</span>
        </div>

        <Button onClick={handlePublish} disabled={isPublishing} size="sm" className="gap-2">
          {isPublishing ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Publishing on-chain...
            </>
          ) : (
            <>
              <Send className="h-4 w-4" />
              Post
            </>
          )}
        </Button>
      </div>
    </Card>
  )
}
