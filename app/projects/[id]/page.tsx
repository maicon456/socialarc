"use client"

import { useState } from "react"
import { Navbar } from "@/components/navbar"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { CommentItem } from "@/components/comment-item"
import { CommentForm } from "@/components/comment-form"
import { ArrowUp, MessageSquare, ExternalLink, Github, Share2 } from "lucide-react"
import { MOCK_PROJECTS, MOCK_COMMENTS } from "@/lib/mock-data"
import { shortenAddress, generateAvatar } from "@/lib/web3-utils"
import { notFound } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { useWeb3 } from "@/contexts/web3-context"

export default function ProjectDetailPage({ params }: { params: { id: string } }) {
  const { account } = useWeb3()
  const project = MOCK_PROJECTS.find((p) => p.id === params.id)
  const [comments, setComments] = useState(MOCK_COMMENTS.filter((c) => c.projectId === params.id))

  if (!project) {
    notFound()
  }

  const isProjectAuthor = account?.toLowerCase() === project.authorAddress.toLowerCase()

  const handleNewComment = async (content: string) => {
    console.log("[v0] New comment:", content)
    // Simulate adding comment
    await new Promise((resolve) => setTimeout(resolve, 500))
  }

  const handleReply = async (commentId: string, content: string) => {
    console.log("[v0] Reply to comment:", commentId, content)
    // Simulate adding reply
    await new Promise((resolve) => setTimeout(resolve, 500))
  }

  const handleUpvote = async (commentId: string) => {
    console.log("[v0] Upvote comment:", commentId)
    // Simulate upvote
  }

  const handleAcceptSolution = async (commentId: string) => {
    console.log("[v0] Accept solution:", commentId)
    // Simulate accepting solution
  }

  return (
    <div className="min-h-screen">
      <Navbar />

      <div className="container mx-auto px-4 py-8">
        <div className="grid gap-8 lg:grid-cols-[1fr,300px]">
          <main className="space-y-6">
            <Card className="overflow-hidden">
              {project.imageUrl && (
                <div className="relative h-80 w-full overflow-hidden bg-muted">
                  <Image
                    src={project.imageUrl || "/placeholder.svg"}
                    alt={project.title}
                    fill
                    className="object-cover"
                  />
                </div>
              )}
              <div className="p-8">
                <div className="mb-4 flex items-start justify-between">
                  <h1 className="text-4xl font-bold leading-tight">{project.title}</h1>
                  <div className="flex gap-2">
                    <Button variant="outline" size="icon">
                      <Share2 className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="icon" asChild>
                      <a href={project.githubUrl} target="_blank" rel="noopener noreferrer">
                        <Github className="h-4 w-4" />
                      </a>
                    </Button>
                  </div>
                </div>

                <div className="mb-6 flex flex-wrap gap-2">
                  {project.tags.map((tag) => (
                    <Badge key={tag} variant="secondary">
                      #{tag}
                    </Badge>
                  ))}
                </div>

                <p className="text-lg leading-relaxed text-foreground">{project.description}</p>

                <div className="mt-8 border-t border-border pt-6">
                  <h2 className="mb-4 text-xl font-bold">Tech Stack</h2>
                  <div className="flex flex-wrap gap-2">
                    {project.stack.map((tech) => (
                      <Badge key={tech} variant="outline">
                        {tech}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="mt-8 border-t border-border pt-6">
                  <h2 className="mb-4 text-xl font-bold">IPFS Details</h2>
                  <div className="rounded-lg bg-muted p-4">
                    <p className="font-mono text-sm">
                      <span className="text-muted-foreground">Hash: </span>
                      {project.ipfsHash}
                    </p>
                    <Button variant="link" className="mt-2 h-auto p-0" asChild>
                      <a
                        href={`https://ipfs.io/ipfs/${project.ipfsHash}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1"
                      >
                        View on IPFS
                        <ExternalLink className="h-3 w-3" />
                      </a>
                    </Button>
                  </div>
                </div>
              </div>
            </Card>

            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold">Support & Discussion</h2>
                <span className="text-sm text-muted-foreground">{comments.length} comments</span>
              </div>

              <CommentForm onSubmit={handleNewComment} />

              <div className="space-y-4">
                {comments.length === 0 ? (
                  <Card className="p-12 text-center">
                    <MessageSquare className="mx-auto h-12 w-12 mb-4 opacity-50 text-muted-foreground" />
                    <p className="text-muted-foreground">No comments yet. Be the first to ask a question!</p>
                  </Card>
                ) : (
                  comments.map((comment) => (
                    <CommentItem
                      key={comment.id}
                      comment={comment}
                      onReply={handleReply}
                      onUpvote={handleUpvote}
                      onAcceptSolution={handleAcceptSolution}
                      isProjectAuthor={isProjectAuthor}
                    />
                  ))
                )}
              </div>
            </div>
          </main>

          <aside className="space-y-6">
            <Card className="p-6">
              <h3 className="mb-4 font-bold">Author</h3>
              <div className="flex items-start gap-3">
                <Avatar className="h-12 w-12">
                  <AvatarImage src={generateAvatar(project.authorAddress) || "/placeholder.svg"} alt={project.author} />
                  <AvatarFallback>{project.author.slice(0, 2)}</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <Link href={`/developers/${project.authorAddress}`} className="font-medium hover:text-primary">
                    {project.author}
                  </Link>
                  <p className="font-mono text-xs text-muted-foreground">{shortenAddress(project.authorAddress)}</p>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <h3 className="mb-4 font-bold">Project Stats</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-2 text-sm text-muted-foreground">
                    <ArrowUp className="h-4 w-4" />
                    Upvotes
                  </span>
                  <span className="font-semibold">{project.upvotes}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-2 text-sm text-muted-foreground">
                    <MessageSquare className="h-4 w-4" />
                    Comments
                  </span>
                  <span className="font-semibold">{comments.length}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Published</span>
                  <span className="text-sm">
                    {new Date(project.createdAt).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </span>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <Button className="w-full gap-2">
                <ArrowUp className="h-4 w-4" />
                Upvote Project
              </Button>
            </Card>
          </aside>
        </div>
      </div>
    </div>
  )
}
