"use client"

import { useState, useEffect, useRef } from "react"
import { Card } from "./ui/card"
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar"
import { useWeb3 } from "@/contexts/web3-context"
import { useToast } from "@/hooks/use-toast"
import { 
  getAllConversations, 
  getConversation, 
  sendPrivateMessage, 
  markMessagesAsRead,
  getUnreadCount,
  type PrivateMessage 
} from "@/lib/private-messages"
import { X, Send, MessageCircle, Loader2 } from "lucide-react"
import { formatDistanceToNow } from "date-fns"

interface MessengerProps {
  isOpen: boolean
  onClose: () => void
  initialAddress?: string // Address to open conversation with
}

export function Messenger({ isOpen, onClose, initialAddress }: MessengerProps) {
  const [conversations, setConversations] = useState<Array<{
    address: string
    lastMessage: PrivateMessage
    unreadCount: number
  }>>([])
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null)
  const [messages, setMessages] = useState<PrivateMessage[]>([])
  const [messageText, setMessageText] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isSending, setIsSending] = useState(false)
  const [unreadCount, setUnreadCount] = useState(0)
  const { account, isConnected } = useWeb3()
  const { toast } = useToast()
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (isOpen && isConnected) {
      loadConversations()
      loadUnreadCount()
      
      // If initialAddress is provided, open that conversation
      if (initialAddress && !selectedConversation) {
        setSelectedConversation(initialAddress.toLowerCase())
      }
      
      // Listen for new messages
      const handleNewMessage = () => {
        loadConversations()
        if (selectedConversation) {
          loadMessages(selectedConversation)
        }
        loadUnreadCount()
      }
      
      window.addEventListener('new-message', handleNewMessage)
      return () => window.removeEventListener('new-message', handleNewMessage)
    }
  }, [isOpen, isConnected, selectedConversation, initialAddress])

  useEffect(() => {
    if (selectedConversation) {
      loadMessages(selectedConversation)
      markMessagesAsRead(selectedConversation)
    }
  }, [selectedConversation])

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  async function loadConversations() {
    if (!isConnected) return
    
    setIsLoading(true)
    try {
      const convs = await getAllConversations()
      setConversations(convs)
    } catch (error) {
      console.error("Error loading conversations:", error)
    } finally {
      setIsLoading(false)
    }
  }

  async function loadMessages(address: string) {
    if (!isConnected) return
    
    try {
      const msgs = await getConversation(address)
      setMessages(msgs)
      await markMessagesAsRead(address)
      await loadUnreadCount()
    } catch (error) {
      console.error("Error loading messages:", error)
    }
  }

  async function loadUnreadCount() {
    if (!isConnected) return
    
    try {
      const count = await getUnreadCount()
      setUnreadCount(count)
    } catch (error) {
      console.error("Error loading unread count:", error)
    }
  }

  async function handleSendMessage() {
    if (!messageText.trim() || !selectedConversation || !isConnected) return

    setIsSending(true)
    try {
      await sendPrivateMessage(selectedConversation, messageText)
      setMessageText("")
      await loadMessages(selectedConversation)
      await loadConversations()
    } catch (error: any) {
      toast({
        title: "Error sending message",
        description: error.message,
        variant: "destructive",
      })
    } finally {
      setIsSending(false)
    }
  }

  function scrollToBottom() {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  const shortAddress = (address: string) => `${address.slice(0, 6)}...${address.slice(-4)}`

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <Card className="w-full max-w-4xl h-[600px] flex flex-col">
        <div className="flex items-center justify-between p-4 border-b">
          <div className="flex items-center gap-2">
            <MessageCircle className="h-5 w-5" />
            <h2 className="text-lg font-semibold">Messages</h2>
            {unreadCount > 0 && (
              <span className="px-2 py-0.5 text-xs bg-primary text-primary-foreground rounded-full">
                {unreadCount}
              </span>
            )}
          </div>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>

        <div className="flex flex-1 overflow-hidden">
          {/* Conversations List */}
          <div className="w-1/3 border-r overflow-y-auto">
            {isLoading ? (
              <div className="flex items-center justify-center p-8">
                <Loader2 className="h-4 w-4 animate-spin" />
              </div>
            ) : conversations.length === 0 ? (
              <div className="p-8 text-center text-sm text-muted-foreground">
                No conversations yet
              </div>
            ) : (
              <div className="divide-y">
                {conversations.map((conv) => (
                  <button
                    key={conv.address}
                    onClick={() => setSelectedConversation(conv.address)}
                    className={`w-full p-4 text-left hover:bg-muted transition-colors ${
                      selectedConversation === conv.address ? "bg-muted" : ""
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={`https://api.dicebear.com/7.x/shapes/svg?seed=${conv.address}`} />
                        <AvatarFallback>{conv.address.slice(0, 2).toUpperCase()}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <div className="font-semibold text-sm truncate">
                          {shortAddress(conv.address)}
                        </div>
                        <div className="text-xs text-muted-foreground truncate">
                          {conv.lastMessage.content}
                        </div>
                        <div className="text-xs text-muted-foreground mt-1">
                          {formatDistanceToNow(new Date(conv.lastMessage.timestamp), { addSuffix: true })}
                        </div>
                      </div>
                      {conv.unreadCount > 0 && (
                        <span className="px-2 py-0.5 text-xs bg-primary text-primary-foreground rounded-full">
                          {conv.unreadCount}
                        </span>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Messages Area */}
          <div className="flex-1 flex flex-col">
            {selectedConversation ? (
              <>
                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                  {messages.map((message) => {
                    const isFromMe = message.from.toLowerCase() === account?.toLowerCase()
                    
                    return (
                      <div
                        key={message.id}
                        className={`flex gap-2 ${isFromMe ? "justify-end" : "justify-start"}`}
                      >
                        {!isFromMe && (
                          <Avatar className="h-8 w-8">
                            <AvatarImage src={`https://api.dicebear.com/7.x/shapes/svg?seed=${message.from}`} />
                            <AvatarFallback>{message.from.slice(0, 2).toUpperCase()}</AvatarFallback>
                          </Avatar>
                        )}
                        <div className={`max-w-[70%] rounded-lg p-3 ${
                          isFromMe 
                            ? "bg-primary text-primary-foreground" 
                            : "bg-muted"
                        }`}>
                          <p className="text-sm">{message.content}</p>
                          <p className={`text-xs mt-1 ${
                            isFromMe ? "text-primary-foreground/70" : "text-muted-foreground"
                          }`}>
                            {formatDistanceToNow(new Date(message.timestamp), { addSuffix: true })}
                          </p>
                        </div>
                        {isFromMe && (
                          <Avatar className="h-8 w-8">
                            <AvatarImage src={`https://api.dicebear.com/7.x/shapes/svg?seed=${message.from}`} />
                            <AvatarFallback>{message.from.slice(0, 2).toUpperCase()}</AvatarFallback>
                          </Avatar>
                        )}
                      </div>
                    )
                  })}
                  <div ref={messagesEndRef} />
                </div>

                {/* Message Input */}
                <div className="border-t p-4">
                  <div className="flex gap-2">
                    <Input
                      placeholder="Type a message..."
                      value={messageText}
                      onChange={(e) => setMessageText(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                          e.preventDefault()
                          handleSendMessage()
                        }
                      }}
                      disabled={isSending}
                    />
                    <Button 
                      onClick={handleSendMessage} 
                      disabled={!messageText.trim() || isSending}
                    >
                      {isSending ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Send className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center text-muted-foreground">
                Select a conversation to start messaging
              </div>
            )}
          </div>
        </div>
      </Card>
    </div>
  )
}

