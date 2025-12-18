# Arc Network Social Feed Smart Contract

This directory contains the Solidity smart contract for the decentralized social feed on Arc Network.

## Contract: SocialFeed.sol

A fully on-chain social media platform where every interaction (post, like, comment, share) is recorded on the blockchain.

### Features

- **Create Posts**: Publish text, images, and videos with IPFS/Arweave storage
- **Like/Unlike**: Express appreciation for content (on-chain)
- **Comments**: Thread discussions on posts
- **Shares**: Amplify content across the network
- **User Profiles**: Track all posts by address

### Deployment Instructions

#### Prerequisites

- Node.js and npm installed
- Hardhat or Foundry for deployment
- Arc Network RPC endpoint
- USDC for gas fees

#### Using Hardhat

1. Install dependencies:
```bash
npm install --save-dev hardhat @nomicfoundation/hardhat-toolbox
```

2. Configure Hardhat for Arc Network (hardhat.config.js):
```javascript
require("@nomicfoundation/hardhat-toolbox");

module.exports = {
  solidity: "0.8.19",
  networks: {
    arcTestnet: {
      url: "https://rpc.testnet.arc.network",
      chainId: 5042002,
      accounts: [process.env.PRIVATE_KEY] // Your deployer private key
    }
  }
};
```

3. Deploy the contract:
```bash
npx hardhat run scripts/deploy.js --network arcTestnet
```

4. Update the contract address in `lib/social-contract.ts`:
```typescript
export const SOCIAL_CONTRACT_ADDRESS = "0xYourDeployedContractAddress"
```

### Gas Costs (estimated in USDC)

- Create Post: ~0.01 USDC
- Like Post: ~0.001 USDC
- Add Comment: ~0.005 USDC
- Share Post: ~0.002 USDC

### Integration

After deployment, the frontend will automatically interact with the contract using the address in `lib/social-contract.ts`.

### Events

The contract emits the following events for indexing and real-time updates:

- `PostCreated(postId, author, contentHash, timestamp)`
- `PostLiked(postId, user)`
- `PostUnliked(postId, user)`
- `CommentAdded(postId, commentId, commenter, content)`
- `PostShared(postId, user)`

### Security Considerations

- All functions are payable to cover gas costs in USDC
- No centralized control - fully decentralized
- Content stored on IPFS/Arweave for censorship resistance
- User addresses are public (blockchain transparency)

### Future Improvements

- Add NFT minting for viral posts
- Implement token rewards for engagement
- Add moderation via community governance
- Profile customization with metadata
