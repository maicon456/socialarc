export type WalletProvider = "metamask" | "rainbow" | "walletconnect" | "coinbase" | "trust" | "injected"

export interface WalletInfo {
  id: WalletProvider
  name: string
  icon: string
  description: string
  downloadUrl?: string
}

export const SUPPORTED_WALLETS: WalletInfo[] = [
  {
    id: "metamask",
    name: "MetaMask",
    icon: "https://upload.wikimedia.org/wikipedia/commons/3/36/MetaMask_Fox.svg",
    description: "Connect using MetaMask browser extension",
    downloadUrl: "https://metamask.io/download/",
  },
  {
    id: "rainbow",
    name: "Rainbow",
    icon: "https://avatars.githubusercontent.com/u/48327834?s=200&v=4",
    description: "Connect using Rainbow wallet",
    downloadUrl: "https://rainbow.me/",
  },
  {
    id: "coinbase",
    name: "Coinbase Wallet",
    icon: "https://altcoinsbox.com/wp-content/uploads/2023/03/coinbase-wallet-logo.png",
    description: "Connect using Coinbase Wallet",
    downloadUrl: "https://www.coinbase.com/wallet",
  },
  {
    id: "trust",
    name: "Trust Wallet",
    icon: "https://trustwallet.com/assets/images/media/assets/TWT.png",
    description: "Connect using Trust Wallet",
    downloadUrl: "https://trustwallet.com/",
  },
  {
    id: "injected",
    name: "Browser Wallet",
    icon: "/leather-wallet-contents.png",
    description: "Connect using your browser wallet",
  },
]

export function detectWalletProvider(): WalletProvider | null {
  if (typeof window === "undefined") return null

  const { ethereum } = window as any

  if (!ethereum) return null

  // Check for specific wallet providers
  if (ethereum.isMetaMask) return "metamask"
  if (ethereum.isRainbow) return "rainbow"
  if (ethereum.isCoinbaseWallet) return "coinbase"
  if (ethereum.isTrust) return "trust"

  // Generic injected provider
  return "injected"
}

export async function connectToProvider(providerId: WalletProvider): Promise<string[]> {
  if (typeof window === "undefined") {
    throw new Error("Window is not defined")
  }

  const { ethereum } = window as any

  if (!ethereum) {
    const wallet = SUPPORTED_WALLETS.find((w) => w.id === providerId)
    throw new Error(`No wallet provider found. Please install ${wallet?.name || "a wallet"}`)
  }

  // For specific wallet providers, we can add custom connection logic here
  // For now, we use the standard EIP-1193 request
  try {
    const accounts = await ethereum.request({
      method: "eth_requestAccounts",
    })
    return accounts
  } catch (error) {
    console.error(`Failed to connect to ${providerId}:`, error)
    throw error
  }
}
