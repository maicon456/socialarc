"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { switchToArcnet, generateAvatar } from "@/lib/web3-utils"
import { connectToProvider, detectWalletProvider, type WalletProvider } from "@/lib/wallet-providers"
import { ethers } from "ethers"

interface Web3ContextType {
  account: string | null
  isConnected: boolean
  isConnecting: boolean
  avatar: string | null
  connectedProvider: WalletProvider | null
  balance: string | null
  connectWallet: (providerId?: WalletProvider) => Promise<void>
  disconnectWallet: () => void
  refreshBalance: () => Promise<void>
}

const Web3Context = createContext<Web3ContextType | undefined>(undefined)

export function Web3Provider({ children }: { children: ReactNode }) {
  const [account, setAccount] = useState<string | null>(null)
  const [isConnecting, setIsConnecting] = useState(false)
  const [avatar, setAvatar] = useState<string | null>(null)
  const [connectedProvider, setConnectedProvider] = useState<WalletProvider | null>(null)
  const [balance, setBalance] = useState<string | null>(null)

  useEffect(() => {
    checkConnection()

    if (typeof window.ethereum !== "undefined") {
      window.ethereum.on("accountsChanged", handleAccountsChanged)
      window.ethereum.on("chainChanged", () => window.location.reload())
    }

    return () => {
      if (typeof window.ethereum !== "undefined") {
        window.ethereum.removeListener("accountsChanged", handleAccountsChanged)
      }
    }
  }, [])

  useEffect(() => {
    if (account) {
      refreshBalance()
      // Refresh balance every 10 seconds
      const interval = setInterval(() => {
        refreshBalance()
      }, 10000)
      return () => clearInterval(interval)
    } else {
      setBalance(null)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [account])

  async function refreshBalance() {
    if (!account || typeof window.ethereum === "undefined") {
      setBalance(null)
      return
    }

    try {
      const provider = new ethers.BrowserProvider(window.ethereum)
      const balanceWei = await provider.getBalance(account)
      const balanceFormatted = ethers.formatEther(balanceWei)
      setBalance(parseFloat(balanceFormatted).toFixed(4))
    } catch (error) {
      console.error("[Web3] Failed to fetch balance:", error)
      setBalance(null)
    }
  }

  async function checkConnection() {
    if (typeof window.ethereum === "undefined") return

    try {
      const accounts = await window.ethereum.request({ method: "eth_accounts" })
      if (accounts.length > 0) {
        setAccount(accounts[0])
        setAvatar(generateAvatar(accounts[0]))
        const provider = detectWalletProvider()
        setConnectedProvider(provider)

        // Always ensure we're on Arcnet when reconnecting
        try {
          await switchToArcnet()
          console.log("[Web3] Reconectado e mudado para Arc Network")
        } catch (err: any) {
          console.warn("Falha ao mudar para Arc Network na reconexão:", err)
          // Don't fail silently - try to add network if needed
          if (err.code === 4902) {
            try {
              await window.ethereum.request({
                method: 'wallet_addEthereumChain',
                params: [{
                  chainId: '0x4D0A2',
                  chainName: 'Arc Testnet',
                  nativeCurrency: { name: 'USDC', symbol: 'USDC', decimals: 18 },
                  rpcUrls: ['https://rpc.testnet.arc.network'],
                  blockExplorerUrls: ['https://testnet.arcscan.app'],
                }],
              })
            } catch (addErr) {
              console.error("Falha ao adicionar Arc Network:", addErr)
            }
          }
        }
      }
    } catch (error) {
      console.error("Failed to check connection:", error)
    }
  }

  function handleAccountsChanged(accounts: string[]) {
    if (accounts.length === 0) {
      disconnectWallet()
    } else {
      setAccount(accounts[0])
      setAvatar(generateAvatar(accounts[0]))
      refreshBalance()
    }
  }

  async function connectWallet(providerId?: WalletProvider) {
    if (typeof window.ethereum === "undefined") {
      alert("Por favor, instale uma carteira Web3 como MetaMask, Rainbow ou Coinbase Wallet")
      return
    }

    setIsConnecting(true)

    try {
      const provider = providerId || detectWalletProvider() || "injected"

      // First, request account access
      const accounts = await connectToProvider(provider)

      if (accounts.length > 0) {
        console.log("[Web3] Conta conectada:", accounts[0])
        console.log("[Web3] Mudando para Arc Network...")
        
        // Force switch to Arcnet - this is critical
        try {
          await switchToArcnet()
          console.log("[Web3] Conectado à Arc Network com sucesso!")
          
          // Verify we're on the correct network (accept both chain IDs)
          const chainId = await window.ethereum.request({ method: 'eth_chainId' })
          const chainIdLower = chainId.toLowerCase()
          if (chainIdLower !== '0x4d0a2' && chainIdLower !== '0x4cef52') {
            console.warn("[Web3] Ainda não está na Arc Network. Chain ID atual:", chainId)
            // Try one more time
            await switchToArcnet()
          }
        } catch (networkError: any) {
          console.error("[Web3] Erro ao mudar para Arc Network:", networkError)
          
          // If it's the RPC endpoint conflict, provide helpful message
          if (networkError.message?.includes('same RPC endpoint') || 
              networkError.message?.includes('existing network')) {
            alert("Já existe uma rede Arc Network no MetaMask. Por favor, remova a rede antiga nas configurações do MetaMask ou mude manualmente para a rede Arc Network.")
          } else if (networkError.code === 4902) {
            // Network not added, try to add it
            try {
              await window.ethereum.request({
                method: 'wallet_addEthereumChain',
                params: [{
                  chainId: '0x4D0A2',
                  chainName: 'Arc Testnet',
                  nativeCurrency: {
                    name: 'USDC',
                    symbol: 'USDC',
                    decimals: 18,
                  },
                  rpcUrls: ['https://rpc.testnet.arc.network'],
                  blockExplorerUrls: ['https://testnet.arcscan.app'],
                }],
              })
              // After adding, switch to it
              await switchToArcnet()
            } catch (addError: any) {
              if (addError.message?.includes('same RPC endpoint') || 
                  addError.message?.includes('existing network')) {
                // Try to switch to existing network
                try {
                  await window.ethereum.request({
                    method: 'wallet_switchEthereumChain',
                    params: [{ chainId: '0x4cef52' }],
                  })
                } catch (switchError) {
                  alert("Já existe uma rede Arc Network no MetaMask com Chain ID diferente. Por favor, remova a rede antiga nas configurações do MetaMask ou mude manualmente para a rede Arc Network.")
                }
              } else {
                alert("Falha ao adicionar Arc Network. Por favor, adicione manualmente nas configurações da carteira.")
                throw addError
              }
            }
          } else {
            alert("Falha ao mudar para Arc Network. Por favor, mude manualmente nas configurações da carteira.")
            throw networkError
          }
        }

        setAccount(accounts[0])
        setAvatar(generateAvatar(accounts[0]))
        setConnectedProvider(provider)
        await refreshBalance()
      }
    } catch (error: any) {
      console.error("Falha ao conectar carteira:", error)

      if (error.code === 4001) {
        alert("Conexão cancelada. Por favor, tente novamente.")
      } else if (error.message?.includes("install")) {
        alert(error.message)
      } else if (error.message?.includes("network")) {
        alert("Falha ao mudar para Arc Network. Por favor, adicione Arc Network manualmente nas configurações da carteira.")
      } else {
        alert(`Falha ao conectar carteira: ${error.message || "Erro desconhecido"}`)
      }
      throw error
    } finally {
      setIsConnecting(false)
    }
  }

  function disconnectWallet() {
    setAccount(null)
    setAvatar(null)
    setConnectedProvider(null)
    setBalance(null)
  }

  return (
    <Web3Context.Provider
      value={{
        account,
        isConnected: !!account,
        isConnecting,
        avatar,
        connectedProvider,
        balance,
        connectWallet,
        disconnectWallet,
        refreshBalance,
      }}
    >
      {children}
    </Web3Context.Provider>
  )
}

export function useWeb3() {
  const context = useContext(Web3Context)
  if (context === undefined) {
    throw new Error("useWeb3 must be used within a Web3Provider")
  }
  return context
}

declare global {
  interface Window {
    ethereum?: any
  }
}
