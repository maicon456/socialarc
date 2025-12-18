"use client"

import { useState } from "react"
import { Card } from "./ui/card"
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { Label } from "./ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs"
import { useNostr } from "@/contexts/nostr-context"
import { Key, Download, Upload, Loader2 } from "lucide-react"

export function IdentitySetup() {
  const { createIdentity, importIdentity, identity } = useNostr()
  const [privateKey, setPrivateKey] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  async function handleCreateIdentity() {
    setIsLoading(true)
    try {
      await createIdentity()
    } finally {
      setIsLoading(false)
    }
  }

  async function handleImportIdentity() {
    if (!privateKey.trim()) return
    setIsLoading(true)
    try {
      await importIdentity(privateKey)
      setPrivateKey("")
    } finally {
      setIsLoading(false)
    }
  }

  function handleExportIdentity() {
    if (!identity) return
    const data = JSON.stringify(identity, null, 2)
    const blob = new Blob([data], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "nostr-identity.json"
    a.click()
    URL.revokeObjectURL(url)
  }

  if (identity) {
    return (
      <Card className="p-6">
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
              <Key className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold">Nostr Identity Connected</h3>
              <p className="text-sm text-muted-foreground">{identity.npub}</p>
            </div>
          </div>

          <Button onClick={handleExportIdentity} variant="outline" size="sm" className="gap-2 bg-transparent">
            <Download className="h-4 w-4" />
            Export Identity
          </Button>
        </div>
      </Card>
    )
  }

  return (
    <Card className="p-6">
      <div className="mb-4">
        <h3 className="text-lg font-semibold">Setup Nostr Identity</h3>
        <p className="text-sm text-muted-foreground">Create a new identity or import an existing one</p>
      </div>

      <Tabs defaultValue="create">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="create">Create New</TabsTrigger>
          <TabsTrigger value="import">Import</TabsTrigger>
        </TabsList>

        <TabsContent value="create" className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Generate a new Nostr keypair. Make sure to backup your private key securely.
          </p>
          <Button onClick={handleCreateIdentity} disabled={isLoading} className="w-full gap-2">
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Key className="h-4 w-4" />
                Generate Identity
              </>
            )}
          </Button>
        </TabsContent>

        <TabsContent value="import" className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="privateKey">Private Key (nsec or hex)</Label>
            <Input
              id="privateKey"
              type="password"
              placeholder="nsec1... or hex format"
              value={privateKey}
              onChange={(e) => setPrivateKey(e.target.value)}
            />
          </div>
          <Button onClick={handleImportIdentity} disabled={isLoading || !privateKey} className="w-full gap-2">
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Importing...
              </>
            ) : (
              <>
                <Upload className="h-4 w-4" />
                Import Identity
              </>
            )}
          </Button>
        </TabsContent>
      </Tabs>
    </Card>
  )
}
