import { ARCNET_CONFIG } from "./web3-config"

export function shortenAddress(address: string): string {
  if (!address) return ""
  return `${address.slice(0, 6)}...${address.slice(-4)}`
}

export async function addArcnetNetwork() {
  if (typeof window.ethereum === "undefined") {
    throw new Error("MetaMask is not installed")
  }

  try {
    await window.ethereum.request({
      method: "wallet_addEthereumChain",
      params: [ARCNET_CONFIG],
    })
  } catch (error) {
    console.error("Failed to add Arcnet network:", error)
    throw error
  }
}

export async function switchToArcnet(): Promise<boolean> {
  if (typeof window.ethereum === "undefined") {
    throw new Error("MetaMask is not installed")
  }

  try {
    // First check current chain
    const currentChainId = await window.ethereum.request({ method: 'eth_chainId' })
    
    // If already on Arcnet (check both possible chain IDs), return success
    const currentChainIdLower = currentChainId.toLowerCase()
    if (currentChainIdLower === ARCNET_CONFIG.chainId.toLowerCase() || 
        currentChainIdLower === '0x4cef52') {
      console.log("[Web3] Already on Arc Network")
      return true
    }

    console.log("[Web3] Switching to Arc Network...")
    console.log("[Web3] Current chain:", currentChainId)
    console.log("[Web3] Target chain:", ARCNET_CONFIG.chainId)

    // Try to switch to the official chain ID first
    try {
      await window.ethereum.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: ARCNET_CONFIG.chainId }],
      })

      // Wait a bit for the switch to complete
      await new Promise(resolve => setTimeout(resolve, 1000))

      // Verify we're on the correct network
      const newChainId = await window.ethereum.request({ method: 'eth_chainId' })
      const newChainIdLower = newChainId.toLowerCase()
      if (newChainIdLower === ARCNET_CONFIG.chainId.toLowerCase() || 
          newChainIdLower === '0x4cef52') {
        console.log("[Web3] Successfully switched to Arc Network")
        return true
      }
    } catch (switchError: any) {
      // If switch fails, try the alternative chain ID (0x4cef52)
      if (switchError.code === 4902 || switchError.message?.includes('not added')) {
        console.log("[Web3] Trying alternative Arc Network chain ID...")
        try {
          await window.ethereum.request({
            method: "wallet_switchEthereumChain",
            params: [{ chainId: '0x4cef52' }],
          })
          await new Promise(resolve => setTimeout(resolve, 1000))
          console.log("[Web3] Successfully switched to Arc Network (alternative chain ID)")
          return true
        } catch (altError: any) {
          // If both fail, try to add the network
          if (altError.code === 4902) {
            throw switchError // Throw original error to trigger add network
          }
          throw altError
        }
      } else {
        throw switchError
      }
    }

    return true
  } catch (error: any) {
    // Chain not added yet, try to add it
    if (error.code === 4902 || error.message?.includes('not added')) {
      console.log("[Web3] Arc Network not added, adding it now...")
      try {
        await addArcnetNetwork()
        // Wait a bit after adding
        await new Promise(resolve => setTimeout(resolve, 1000))
        // Try switching again
        await window.ethereum.request({
          method: "wallet_switchEthereumChain",
          params: [{ chainId: ARCNET_CONFIG.chainId }],
        })
        return true
      } catch (addError: any) {
        // If adding fails because network already exists with different chain ID
        if (addError.message?.includes('same RPC endpoint') || 
            addError.message?.includes('existing network')) {
          console.warn("[Web3] Network already exists with different chain ID")
          // Try to switch to the existing network
          try {
            await window.ethereum.request({
              method: "wallet_switchEthereumChain",
              params: [{ chainId: '0x4cef52' }],
            })
            await new Promise(resolve => setTimeout(resolve, 1000))
            console.log("[Web3] Switched to existing Arc Network")
            return true
          } catch (finalError: any) {
            throw new Error("Por favor, remova a rede Arc Network Testnet existente no MetaMask e tente novamente, ou mude manualmente para a rede Arc Network.")
          }
        }
        throw addError
      }
    } else if (error.code === 4001) {
      throw new Error("Usuário rejeitou a troca de rede")
    } else {
      console.error("[Web3] Error switching network:", error)
      // If it's the RPC endpoint conflict error, provide helpful message
      if (error.message?.includes('same RPC endpoint') || 
          error.message?.includes('existing network')) {
        throw new Error("Já existe uma rede Arc Network no MetaMask com Chain ID diferente. Por favor, remova a rede antiga nas configurações do MetaMask ou mude manualmente para a rede Arc Network.")
      }
      throw error
    }
  }
}

export function generateAvatar(address: string): string {
  // Generate identicon-style avatar using address
  return `https://api.dicebear.com/7.x/identicon/svg?seed=${address}`
}
