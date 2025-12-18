# Arc Social - Decentralized Communication DApp

A decentralized social communication platform built on Arc Network with Nostr protocol integration. Experience true censorship-resistant communication where you own your identity and data.

## Features

### 1. Nostr Protocol Integration
- Decentralized identity with cryptographic key pairs (npub/nsec)
- Multi-relay support for redundancy
- End-to-end encrypted direct messages
- Cross-platform identity portability
- Client-side signing and verification

### 2. Arc Network Blockchain
- **Chain ID**: 5042002 (Arc Testnet)
- **Native Gas Token**: USDC (18 decimals)
- **Stable Fee Design**: Predictable fiat-based transaction costs
- **Deterministic Finality**: Sub-second transaction finality
- **EVM Compatible**: Deploy Solidity smart contracts

### 3. Social Feed
- Real-time note publishing and reading
- Subscribe to Nostr relays for event streaming
- Upvote and comment functionality
- User profiles with avatars
- Chronological and filtered feeds

### 4. Relay Management
- Connect to multiple Nostr relays
- Real-time connection status monitoring
- Add custom relay URLs
- Recommended relay discovery
- Geographic relay distribution

### 5. User Discovery
- Browse verified users
- Follow interesting profiles
- Search by name and interests
- View user statistics and activity
- Cross-platform identity verification

### 6. Web3 Wallet Integration
- MetaMask connection to Arc Network
- Automatic network switching
- USDC balance display
- Transaction signing
- Identicon avatar generation

## Tech Stack

### Frontend
- **Next.js 16** - React framework with App Router
- **React 19.2** - Latest React with new features (useEffectEvent, Activity)
- **TypeScript** - Type-safe development
- **Tailwind CSS v4** - Modern utility-first styling
- **shadcn/ui** - High-quality accessible components

### Blockchain
- **Arc Network Testnet** - Layer-1 EVM-compatible blockchain
- **USDC Gas Token** - Stable, predictable transaction fees
- **MetaMask** - Web3 wallet provider
- **Ethers.js** - Ethereum library (implicit)

### Decentralized Protocol
- **Nostr Protocol** - Censorship-resistant social protocol
- **WebSocket Relays** - Real-time event distribution
- **Cryptographic Keys** - Ed25519 key pairs for identity
- **Event Signing** - Client-side message authentication

## Project Structure

```
├── app/
│   ├── page.tsx                    # Homepage with features
│   ├── layout.tsx                  # Root layout with providers
│   ├── globals.css                 # Global styles with Arc branding
│   ├── feed/page.tsx               # Social feed with Nostr events
│   ├── relays/page.tsx             # Relay management
│   ├── users/page.tsx              # User discovery
│   ├── docs/page.tsx               # Arc Network documentation
│   └── profile/page.tsx            # User profile editor
├── components/
│   ├── navbar.tsx                  # Navigation with wallet status
│   ├── footer.tsx                  # Footer with Arc links
│   ├── arc-logo.tsx                # Arc Network branding
│   ├── compose-note.tsx            # Publish Nostr notes
│   ├── note-card.tsx               # Display Nostr events
│   ├── identity-setup.tsx          # Nostr key generation
│   └── ui/                         # shadcn component library
├── contexts/
│   ├── web3-context.tsx            # Arc wallet state
│   └── nostr-context.tsx           # Nostr client state
├── lib/
│   ├── web3-config.ts              # Arc Network configuration
│   ├── web3-utils.ts               # Wallet helpers
│   ├── nostr-types.ts              # Nostr type definitions
│   ├── nostr-client.ts             # Relay connection manager
│   └── nostr-crypto.ts             # Key generation & signing
└── public/
    └── images/                     # Static assets
```

## Getting Started

### Prerequisites
- Node.js 18+ installed
- MetaMask browser extension
- Basic understanding of Web3 and decentralized protocols

### Installation

1. Clone or download the project

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000)

### Connect to Arc Network

#### Network Configuration:
- **Network Name**: Arc Testnet
- **Chain ID**: 5042002
- **RPC URL**: https://rpc.testnet.arc.network
- **Currency Symbol**: USDC
- **Block Explorer**: https://testnet.arcscan.app
- **Faucet**: https://faucet.circle.com

The app will automatically prompt you to add and switch to the Arc Network when you connect your wallet.

#### Get Testnet USDC:
1. Visit the [Arc Faucet](https://faucet.circle.com)
2. Select "Arc Testnet"
3. Enter your wallet address
4. Request testnet USDC for gas fees

### Nostr Setup

1. **Generate Identity**: Click "Create New Identity" to generate a new Nostr key pair
2. **Save Your Keys**: Securely store your private key (nsec) - it cannot be recovered
3. **Connect to Relays**: The app automatically connects to popular Nostr relays
4. **Publish Notes**: Start sharing your thoughts on the decentralized social network

## Key Concepts

### Nostr Protocol

Nostr (Notes and Other Stuff Transmitted by Relays) is a simple, open protocol for decentralized social networking:

- **Decentralized**: No central server or authority
- **Censorship-Resistant**: No one can ban or silence you
- **Portable Identity**: Your identity works across all Nostr apps
- **Client-Side Signing**: You control your keys and content
- **Relay Network**: Multiple independent servers distribute messages

### Arc Network Features

Arc is purpose-built for real-world economic activity:

**Stable Fee Design**
- Gas paid in USDC instead of volatile tokens
- Predictable transaction costs in fiat terms
- Transparent fee structure

**Deterministic Finality**
- Sub-second transaction finality
- No probabilistic confirmations
- Instant settlement for applications

**EVM Compatibility**
- Deploy existing Solidity contracts
- Use familiar development tools
- Access Ethereum ecosystem libraries

**Use Cases**
- Onchain credit and lending
- Capital markets settlement
- Stablecoin FX and swaps
- Cross-border payments
- Agentic commerce

## Architecture

### Web3 Integration

The app uses React Context to manage Web3 state:

```typescript
const { account, connectWallet, isConnected } = useWeb3()
```

Features:
- Automatic network detection and switching
- Persistent connection across page reloads
- Account change detection
- Identicon avatar generation

### Nostr Integration

The Nostr client manages relay connections and event handling:

```typescript
const { identity, publishNote, subscribeToFeed } = useNostr()
```

Features:
- Multi-relay connection pooling
- Event subscription and filtering
- Client-side event signing
- Key management and storage

## Design Philosophy

### Visual Design
- **Dark Theme**: Professional Web3 aesthetic with Arc branding
- **Purple/Blue Gradient**: Primary colors reflecting Arc identity
- **Glassmorphism**: Modern translucent card effects
- **Accessibility**: WCAG 2.1 AA compliant

### User Experience
- **No Account Required**: Just connect wallet or generate Nostr keys
- **Progressive Enhancement**: Works without wallet connection
- **Mobile First**: Responsive design for all devices
- **Performance**: Optimized bundle size and lazy loading

### Security
- **Client-Side Keys**: Private keys never leave the browser
- **No Backend**: Fully decentralized architecture
- **Content Signing**: All messages cryptographically signed
- **Relay Independence**: No single point of failure

## Resources

### Arc Network
- [Official Documentation](https://docs.arc.network)
- [Arc Testnet Explorer](https://testnet.arcscan.app)
- [Testnet Faucet](https://faucet.circle.com)
- [Arc Website](https://arc.network)

### Nostr Protocol
- [Nostr Protocol Spec](https://github.com/nostr-protocol/nostr)
- [Nostr.how - Learn Nostr](https://nostr.how)
- [Nostr Clients](https://nostr.com)
- [Relay List](https://nostr.watch)

## Future Enhancements

- [ ] Direct encrypted messaging between users
- [ ] On-chain identity verification via Arc smart contracts
- [ ] IPFS integration for media attachments
- [ ] Lightning Network integration for micropayments
- [ ] Advanced relay selection algorithms
- [ ] Content moderation preferences
- [ ] Follow/follower graphs
- [ ] Trending topics and discovery
- [ ] Profile customization and badges
- [ ] Mobile app (React Native)

## Contributing

Contributions are welcome! To contribute:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

MIT License - Feel free to use this as a template for your own decentralized social applications.

## Support

- **Documentation**: See `/docs` page in the app
- **Issues**: Open a GitHub issue
- **Community**: Join the Arc Network community

---

Built with Next.js 16, React 19, Nostr Protocol, and Arc Network

**Chain ID**: 5042002 | **Gas Token**: USDC | **Protocol**: Nostr
