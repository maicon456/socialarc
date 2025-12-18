// Arc Network configuration - Testnet (Official values from docs.arc.network)
export const ARCNET_CONFIG = {
  chainId: "0x4D0A2", // Arc Testnet Chain ID: 5042002 in hex (0x4D0A2)
  chainName: "Arc Testnet",
  nativeCurrency: {
    name: "USDC",
    symbol: "USDC",
    decimals: 18,
  },
  rpcUrls: [
    "https://rpc.testnet.arc.network",
  ],
  blockExplorerUrls: ["https://testnet.arcscan.app"],
}

export const CONTRACT_ADDRESSES = {
  marketplace: "0x0000000000000000000000000000000000000000", // Replace with deployed contract
  reputation: "0x0000000000000000000000000000000000000000", // Replace with deployed contract
  services: "0x0000000000000000000000000000000000000000", // Replace with deployed contract
}

export const ARC_LINKS = {
  explorer: "https://testnet.arcscan.app",
  faucet: "https://easyfaucetarc.xyz/",
  docs: "https://docs.arc.network",
  rpc: "https://rpc.testnet.arc.network",
  website: "https://arc.network",
  twitter: "https://twitter.com/arcnetwork",
  github: "https://github.com/arc-network",
  discord: "https://discord.gg/arcnetwork",
}
