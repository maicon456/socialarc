# Script para configurar .env.local
# Execute: .\setup-env.ps1

$envContent = @"
# Arc Network Configuration
NEXT_PUBLIC_ARCNET_RPC=https://rpc.testnet.arc.network
NEXT_PUBLIC_ARCNET_CHAIN_ID=0x4D0A2

# Smart Contract Address (será preenchido após deploy)
NEXT_PUBLIC_CONTRACT_ADDRESS=0x0000000000000000000000000000000000000000
NEXT_PUBLIC_SOCIAL_CONTRACT_ADDRESS=0x0000000000000000000000000000000000000000

# Deploy Configuration
PRIVATE_KEY=7037a2d5e0fab06911c4fc98f09ef19d5558194440d7438bd099ae78e234228c
ARCNET_RPC_URL=https://rpc.testnet.arc.network

# IPFS/Pinata (opcional)
NEXT_PUBLIC_PINATA_API_KEY=
NEXT_PUBLIC_PINATA_SECRET_KEY=

# Relay WebSocket (opcional)
NEXT_PUBLIC_RELAY_WS=wss://relay.damus.io
"@

$envContent | Out-File -FilePath .env.local -Encoding utf8 -NoNewline
Write-Host "✅ Arquivo .env.local criado com sucesso!" -ForegroundColor Green
Write-Host "⚠️  IMPORTANTE: Este arquivo contém sua chave privada. Nunca o commite no Git!" -ForegroundColor Yellow

