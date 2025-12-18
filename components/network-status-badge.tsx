"use client"

import { useEffect, useState } from "react"
import { useWeb3 } from "@/contexts/web3-context"
import { isArcnetNetwork, switchToArcnet } from "@/lib/network"
import { Button } from "./ui/button"
import { Alert, AlertDescription, AlertTitle } from "./ui/alert"
import { CheckCircle2, AlertTriangle, Loader2 } from "lucide-react"

export function NetworkStatusBadge() {
  const { isConnected } = useWeb3()
  const [isCorrectNetwork, setIsCorrectNetwork] = useState<boolean | null>(null)
  const [isChecking, setIsChecking] = useState(false)
  const [isSwitching, setIsSwitching] = useState(false)

  useEffect(() => {
    if (!isConnected) {
      setIsCorrectNetwork(null)
      return
    }

    checkNetwork()

    // Listen for network changes
    if (typeof window !== "undefined" && window.ethereum) {
      const handleChainChanged = () => {
        checkNetwork()
      }

      window.ethereum.on("chainChanged", handleChainChanged)

      return () => {
        if (window.ethereum) {
          window.ethereum.removeListener("chainChanged", handleChainChanged)
        }
      }
    }
  }, [isConnected])

  async function checkNetwork() {
    if (typeof window === "undefined") return

    setIsChecking(true)
    try {
      const isArcnet = await isArcnetNetwork()
      setIsCorrectNetwork(isArcnet)
    } catch (error) {
      console.error("Erro ao verificar rede:", error)
      setIsCorrectNetwork(false)
    } finally {
      setIsChecking(false)
    }
  }

  async function handleSwitchNetwork() {
    setIsSwitching(true)
    try {
      await switchToArcnet()
      await checkNetwork()
    } catch (error: any) {
      console.error("Erro ao mudar de rede:", error)
      alert("Erro ao mudar para Arc Network: " + (error.message || error))
    } finally {
      setIsSwitching(false)
    }
  }

  if (!isConnected || isCorrectNetwork === null) {
    return null
  }

  if (isChecking) {
    return (
      <Alert className="border-muted">
        <Loader2 className="h-4 w-4 animate-spin" />
        <AlertTitle>Verificando rede...</AlertTitle>
        <AlertDescription>Verificando se está conectado à Arc Network</AlertDescription>
      </Alert>
    )
  }

  if (isCorrectNetwork) {
    return (
      <Alert className="border-green-500/50 bg-green-500/10">
        <CheckCircle2 className="h-4 w-4 text-green-500" />
        <AlertTitle className="text-green-500">Conectado à Arc Testnet</AlertTitle>
        <AlertDescription className="text-green-500/80">
          Você está na rede correta. Todas as transações serão processadas na Arc Network.
        </AlertDescription>
      </Alert>
    )
  }

  return (
    <Alert className="border-yellow-500/50 bg-yellow-500/10">
      <AlertTriangle className="h-4 w-4 text-yellow-500" />
      <AlertTitle className="text-yellow-500">Rede Incorreta</AlertTitle>
      <AlertDescription className="text-yellow-500/80">
        Você precisa estar conectado à Arc Testnet para usar este dapp.
        <Button
          onClick={handleSwitchNetwork}
          disabled={isSwitching}
          size="sm"
          className="ml-2 mt-2"
          variant="outline"
        >
          {isSwitching ? (
            <>
              <Loader2 className="mr-2 h-3 w-3 animate-spin" />
              Mudando...
            </>
          ) : (
            "Mudar para Arc Network"
          )}
        </Button>
      </AlertDescription>
    </Alert>
  )
}

