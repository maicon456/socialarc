# Architecture Documentation

## System Overview

ArcnetDev is a full-stack Web3 application built on Next.js 16 with the App Router. The architecture follows modern best practices for React applications with Web3 integration.

## Core Architecture Patterns

### 1. Component Architecture

**Atomic Design Principles:**
- **Atoms**: Basic UI components (Button, Input, Card)
- **Molecules**: Composed components (WalletConnectButton, ReputationBadge)
- **Organisms**: Complex features (Navbar, ProjectCard, CommentThread)
- **Pages**: Complete views (HomePage, ProjectDetailPage)

### 2. State Management

**Global State (Web3Context):**
```typescript
interface Web3ContextType {
  account: string | null
  isConnected: boolean
  isConnecting: boolean
  avatar: string | null
  connectWallet: () => Promise<void>
  disconnectWallet: () => void
}
```

**Local State:**
- Component-level state with useState
- Form state management
- UI state (modals, dropdowns)

**Server State:**
- For production: Use SWR or React Query
- Currently: Mock data imports

### 3. Data Flow

```
User Action → Component Event
    ↓
State Update (Context/useState)
    ↓
Re-render
    ↓
UI Update
```

**Web3 Flow:**
```
User clicks "Connect"
    ↓
Web3Context.connectWallet()
    ↓
MetaMask popup
    ↓
Network check/switch
    ↓
Account stored in Context
    ↓
Avatar generated
    ↓
UI updated globally
```

### 4. Reputation System Architecture

**Calculation Logic:**
```typescript
// Base points for actions
PROJECT_PUBLISHED: 50
SERVICE_COMPLETED: 40
SOLUTION_ACCEPTED: 25
COMMENT_HELPFUL: 10
UPVOTE_RECEIVED: 5

// Level thresholds
Level 1: 0-249 (Beginner)
Level 2: 250-999 (Advanced)
Level 3: 1000-2499 (Expert)
Level 4: 2500-4999 (Master)
Level 5: 5000+ (Legend)
```

**Badge System:**
```typescript
interface ReputationBadge {
  id: string
  name: string
  description: string
  icon: string
  earnedAt: number
  category: "contribution" | "expertise" | "community" | "achievement"
}
```

Badges are calculated dynamically based on developer stats:
- `calculateEarnedBadges(developer)` runs on data load
- Checks against badge requirements
- Returns array of earned badges
- Displayed in profiles and cards

### 5. Routing Structure

**App Router (Next.js 16):**
```
/ (home)
├── /projects
│   ├── /new (create)
│   └── /[id] (details)
├── /services
│   ├── /new (create)
│   └── /[id] (details)
├── /developers
│   └── /[address] (profile)
├── /reputation (info)
└── /profile (edit)
```

**Dynamic Routes:**
- `[id]` - Project/Service ID
- `[address]` - Ethereum address

### 6. Type System

**Core Interfaces:**
```typescript
Project {
  id, title, description, stack, tags
  githubUrl, imageUrl, ipfsHash
  author, authorAddress
  upvotes, commentCount
}

Developer {
  address, name, bio, stack
  socialLinks, profileHash
  reputation, badges
  stats (projects, solutions, services)
}

Service {
  id, title, description, category
  price, duration, stack
  provider, rating, completedJobs
}

Comment {
  id, projectId, author, content
  upvotes, isAcceptedSolution, replies
}
```

### 7. Web3 Integration Layer

**Network Configuration:**
```typescript
ARCNET_CONFIG = {
  chainId: "0x4D2" (1234)
  chainName: "Arcnet"
  rpcUrls: ["https://rpc.arcnet.network"]
  nativeCurrency: { name: "ARC", symbol: "ARC", decimals: 18 }
}
```

**Wallet Connection Flow:**
1. Detect MetaMask
2. Request accounts
3. Check current network
4. Switch if needed (eth_addEthereumChain)
5. Store account in context
6. Generate avatar (Identicon)

### 8. IPFS Integration

**Current Implementation:**
- Hash generation (mock)
- IPFS gateway links (ipfs.io)
- Content addressing

**Production Requirements:**
- Upload to IPFS (Pinata/Web3.Storage)
- Store hash on-chain
- Retrieve via gateway
- Pin important content

### 9. Nostr Integration

**Architecture:**
```typescript
NostrClient {
  - Connect to relays (WebSocket)
  - Subscribe to events
  - Publish messages
  - Handle relay messages
}
```

**Relay Communication:**
```
Client → ["REQ", subId, filters] → Relay
Client ← ["EVENT", subId, event] ← Relay
Client → ["CLOSE", subId] → Relay
```

### 10. Performance Optimizations

**Current:**
- React Server Components for static content
- Client components only where needed
- Image optimization (Next.js Image)
- Code splitting (automatic with App Router)

**Recommended:**
- SWR for data fetching/caching
- Lazy loading for modals
- Virtual scrolling for long lists
- Service Worker for offline support

### 11. Security Considerations

**Current Implementation:**
- No private key handling (MetaMask)
- Client-side only (no backend)
- IPFS for decentralized storage

**Production Requirements:**
- Input sanitization
- Rate limiting
- Smart contract audits
- Signature verification
- CORS configuration
- Content Security Policy

### 12. Deployment Architecture

**Vercel Deployment:**
```
Git Push → Vercel Build
    ↓
Static Generation (RSC)
    ↓
Edge Network Distribution
    ↓
Global CDN
```

**Environment Variables:**
- NEXT_PUBLIC_ARCNET_RPC
- NEXT_PUBLIC_IPFS_GATEWAY
- Contract addresses (future)

## Future Enhancements

### Smart Contract Integration
1. Deploy contract registry
2. On-chain reputation tracking
3. Service marketplace contracts
4. Payment handling (ARC tokens)

### Backend Services
1. IPFS upload service
2. Indexing service (The Graph)
3. Notification system
4. Analytics tracking

### Advanced Features
1. Real-time messaging (WebSocket)
2. Advanced search (Algolia)
3. NFT badges
4. DAO governance
5. Multi-chain support

## Development Guidelines

1. **Always use TypeScript** - No any types
2. **Component composition** - Keep components small
3. **Server Components first** - Use client only when needed
4. **Accessibility** - ARIA labels, semantic HTML
5. **Performance** - Optimize images, lazy load
6. **Testing** - Unit tests for utils, E2E for flows
7. **Documentation** - Comment complex logic

---

This architecture provides a solid foundation for a production-ready Web3 marketplace while maintaining flexibility for future enhancements.
