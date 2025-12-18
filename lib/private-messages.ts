import { ethers } from 'ethers'

// Helper function to get provider and signer
async function getProviderAndSigner() {
  if (typeof window === 'undefined' || !window.ethereum) {
    throw new Error('MetaMask ou carteira EVM não detectada')
  }

  const provider = new ethers.BrowserProvider(window.ethereum, 'any')
  const signer = await provider.getSigner()
  const address = await signer.getAddress()

  return { provider, signer, address }
}

export interface PrivateMessage {
  id: string
  from: string
  to: string
  content: string
  timestamp: number
  read: boolean
}

const MESSAGES_STORAGE_KEY = 'arcnet_messages'

/**
 * Send a private message
 */
export async function sendPrivateMessage(
  toAddress: string,
  content: string
): Promise<string> {
  if (typeof window === 'undefined') {
    throw new Error('Must be called from browser')
  }

  const { address } = await getProviderAndSigner()
  
  if (address.toLowerCase() === toAddress.toLowerCase()) {
    throw new Error('Cannot send message to yourself')
  }

  if (!content.trim()) {
    throw new Error('Message content cannot be empty')
  }

  const messageId = ethers.id(`${address}-${toAddress}-${Date.now()}-${content}`)
  
  const message: PrivateMessage = {
    id: messageId,
    from: address.toLowerCase(),
    to: toAddress.toLowerCase(),
    content: content.trim(),
    timestamp: Date.now(),
    read: false,
  }

  const messages = getMessages()
  const conversationKey = getConversationKey(address, toAddress)
  
  if (!messages[conversationKey]) {
    messages[conversationKey] = []
  }
  
  messages[conversationKey].push(message)
  localStorage.setItem(MESSAGES_STORAGE_KEY, JSON.stringify(messages))

  // Dispatch event for real-time updates
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('new-message', { detail: message }))
  }

  return messageId
}

/**
 * Get conversation between two users
 */
export async function getConversation(
  otherAddress: string
): Promise<PrivateMessage[]> {
  if (typeof window === 'undefined') {
    return []
  }

  try {
    const { address } = await getProviderAndSigner()
    const messages = getMessages()
    const conversationKey = getConversationKey(address, otherAddress)
    
    return messages[conversationKey] || []
  } catch {
    return []
  }
}

/**
 * Get all conversations for current user
 */
export async function getAllConversations(): Promise<Array<{
  address: string
  lastMessage: PrivateMessage
  unreadCount: number
}>> {
  if (typeof window === 'undefined') {
    return []
  }

  try {
    const { address } = await getProviderAndSigner()
    const messages = getMessages()
    const conversations: Array<{
      address: string
      lastMessage: PrivateMessage
      unreadCount: number
    }> = []
    
    const seenAddresses = new Set<string>()
    
    for (const key in messages) {
      const [addr1, addr2] = key.split('-')
      const otherAddress = addr1.toLowerCase() === address.toLowerCase() 
        ? addr2.toLowerCase() 
        : addr1.toLowerCase()
      
      if (seenAddresses.has(otherAddress)) continue
      seenAddresses.add(otherAddress)
      
      const conversationMessages = messages[key] || []
      const unreadCount = conversationMessages.filter(
        (msg: PrivateMessage) => 
          !msg.read && msg.to.toLowerCase() === address.toLowerCase()
      ).length
      
      if (conversationMessages.length > 0) {
        conversations.push({
          address: otherAddress,
          lastMessage: conversationMessages[conversationMessages.length - 1],
          unreadCount,
        })
      }
    }
    
    // Sort by last message timestamp (newest first)
    conversations.sort((a, b) => b.lastMessage.timestamp - a.lastMessage.timestamp)
    
    return conversations
  } catch {
    return []
  }
}

/**
 * Mark messages as read
 */
export async function markMessagesAsRead(otherAddress: string): Promise<void> {
  if (typeof window === 'undefined') {
    return
  }

  try {
    const { address } = await getProviderAndSigner()
    const messages = getMessages()
    const conversationKey = getConversationKey(address, otherAddress)
    
    if (messages[conversationKey]) {
      messages[conversationKey] = messages[conversationKey].map((msg: PrivateMessage) => {
        if (msg.to.toLowerCase() === address.toLowerCase() && !msg.read) {
          return { ...msg, read: true }
        }
        return msg
      })
      
      localStorage.setItem(MESSAGES_STORAGE_KEY, JSON.stringify(messages))
    }
  } catch (error) {
    console.error('[Messages] Error marking as read:', error)
  }
}

/**
 * Get unread message count
 */
export async function getUnreadCount(): Promise<number> {
  if (typeof window === 'undefined') {
    return 0
  }

  try {
    const { address } = await getProviderAndSigner()
    const messages = getMessages()
    let count = 0
    
    for (const key in messages) {
      const conversationMessages = messages[key] || []
      count += conversationMessages.filter(
        (msg: PrivateMessage) => 
          !msg.read && msg.to.toLowerCase() === address.toLowerCase()
      ).length
    }
    
    return count
  } catch {
    return 0
  }
}

function getMessages(): Record<string, PrivateMessage[]> {
  if (typeof window === 'undefined') {
    return {}
  }

  try {
    const stored = localStorage.getItem(MESSAGES_STORAGE_KEY)
    return stored ? JSON.parse(stored) : {}
  } catch {
    return {}
  }
}

function getConversationKey(address1: string, address2: string): string {
  const addr1 = address1.toLowerCase()
  const addr2 = address2.toLowerCase()
  return addr1 < addr2 ? `${addr1}-${addr2}` : `${addr2}-${addr1}`
}

