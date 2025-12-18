# 🚀 Guia Rápido de Deploy

## Pré-requisitos

1. **Node.js 18+** instalado
2. **Chave privada** da carteira com USDC na Arc Testnet
3. **USDC de teste** (obtenha em https://faucet.circle.com)

## ⚡ Deploy Rápido (3 passos)

### 1. Configurar Variáveis de Ambiente

Crie um arquivo `.env.local` na raiz do projeto:

```bash
# Copie o exemplo
cp .env.example .env.local
```

Edite `.env.local` e adicione sua chave privada:

```env
PRIVATE_KEY=sua_chave_privada_aqui_sem_0x
ARCNET_RPC_URL=https://rpc.testnet.arc.network
```

⚠️ **IMPORTANTE**: Nunca commite o arquivo `.env.local` no Git!

### 2. Instalar Dependências de Deploy

```bash
npm install --save-dev hardhat @nomicfoundation/hardhat-toolbox dotenv
```

### 3. Deploy dos Contratos

**Deploy de todos os contratos:**
```bash
npm run deploy:contracts
```

**Ou deploy individual:**

```bash
# Apenas ArcnetNostr
npm run deploy:arcnet-nostr

# Apenas SocialFeed
npm run deploy:social-feed
```

### 4. Atualizar Configuração

Após o deploy, copie os endereços dos contratos e adicione ao `.env.local`:

```env
NEXT_PUBLIC_CONTRACT_ADDRESS=0x... (endereço do ArcnetNostr)
NEXT_PUBLIC_SOCIAL_CONTRACT_ADDRESS=0x... (endereço do SocialFeed)
```

Atualize também os arquivos:
- `lib/contract.ts` → `ARCNET_NOSTR_ADDRESS`
- `lib/social-contract.ts` → `SOCIAL_CONTRACT_ADDRESS`

## 🌐 Deploy do Frontend

### Vercel (Recomendado)

1. Conecte seu repositório ao Vercel
2. Configure as variáveis de ambiente no painel:
   - `NEXT_PUBLIC_CONTRACT_ADDRESS`
   - `NEXT_PUBLIC_SOCIAL_CONTRACT_ADDRESS`
   - `NEXT_PUBLIC_ARCNET_RPC`
3. Deploy automático a cada push

### Build Local

```bash
npm run build
npm start
```

## ✅ Checklist

- [ ] Chave privada configurada no `.env.local`
- [ ] USDC de teste na carteira
- [ ] Dependências instaladas (`npm install`)
- [ ] Hardhat instalado (`npm install --save-dev hardhat @nomicfoundation/hardhat-toolbox dotenv`)
- [ ] Contratos deployados
- [ ] Endereços dos contratos atualizados no `.env.local`
- [ ] Arquivos de configuração atualizados
- [ ] Frontend buildado e testado

## 🔗 Links Úteis

- **Faucet**: https://faucet.circle.com
- **Explorer**: https://testnet.arcscan.app
- **RPC**: https://rpc.testnet.arc.network
- **Docs**: https://docs.arc.network

## 🐛 Troubleshooting

### Erro: "Insufficient funds"
→ Obtenha USDC de teste no faucet

### Erro: "Network not found"
→ Verifique se está usando a RPC correta: `https://rpc.testnet.arc.network`

### Erro: "Private key not found"
→ Verifique se o `.env.local` existe e contém `PRIVATE_KEY`

### Erro de compilação
→ Execute `npm run compile` para ver erros detalhados



