# 📋 Contratos do DApp - Documentação Completa

## 📦 Visão Geral

O dapp utiliza **2 contratos inteligentes** deployados na **Arc Network Testnet**:

1. **ArcnetNostr.sol** - Registro de eventos Nostr on-chain
2. **SocialFeed.sol** - Rede social descentralizada completa

---

## 1️⃣ Contrato: ArcnetNostr.sol

### 📝 Descrição
Contrato simples para registrar hashes de eventos Nostr na blockchain Arc Network.

### 🔧 Funcionalidades

#### Funções Principais:
- **`registerEvent(eventId, ipfsUri)`** - Registra um evento on-chain
- **`getEvent(eventId)`** - Obtém dados de um evento
- **`getUserEvents(user)`** - Lista todos os eventos de um usuário
- **`eventExists(eventId)`** - Verifica se um evento existe

#### Estrutura de Dados:
```solidity
struct EventRecord {
    string eventId;
    address author;
    string ipfsUri;
    uint256 timestamp;
    bool exists;
}
```

### 📍 Endereço Atual
```
0xe22C09345E1c8DF663143B5e931AcaCFd814182B
```

### 🔗 Explorer
https://testnet.arcscan.app/address/0xe22C09345E1c8DF663143B5e931AcaCFd814182B

### 📂 Arquivos Relacionados
- **Contrato:** `contracts/ArcnetNostr.sol`
- **ABI/Integração:** `lib/contract.ts`
- **Script de Deploy:** `scripts/deploy-arcnet-nostr.js`

---

## 2️⃣ Contrato: SocialFeed.sol

### 📝 Descrição
Rede social descentralizada onde todas as interações (posts, likes, comentários, shares) são registradas on-chain.

### 🔧 Funcionalidades

#### Funções Principais:

**Posts:**
- **`createPost(contentHash, contentType, mediaUrls)`** - Cria um novo post
- **`getPost(postId)`** - Obtém dados de um post
- **`getAllPosts()`** - Lista todos os posts
- **`getUserPosts(user)`** - Lista posts de um usuário
- **`getTotalPosts()`** - Conta total de posts

**Interações:**
- **`likePost(postId)`** - Curtir um post
- **`unlikePost(postId)`** - Descurtir um post
- **`hasLiked(postId, user)`** - Verifica se usuário curtiu
- **`addComment(postId, content)`** - Adicionar comentário
- **`getPostComments(postId)`** - Obter comentários
- **`sharePost(postId)`** - Compartilhar post

#### Estruturas de Dados:
```solidity
struct Post {
    uint256 id;
    address author;
    string contentHash;      // IPFS hash
    string contentType;       // "text", "image", "video", "mixed"
    string[] mediaUrls;       // URLs IPFS/Arweave
    uint256 timestamp;
    uint256 likes;
    uint256 comments;
    uint256 shares;
}

struct Comment {
    uint256 id;
    uint256 postId;
    address commenter;
    string content;
    uint256 timestamp;
}
```

#### Eventos Emitidos:
- `PostCreated(postId, author, contentHash, timestamp)`
- `PostLiked(postId, user)`
- `PostUnliked(postId, user)`
- `CommentAdded(postId, commentId, commenter, content)`
- `PostShared(postId, user)`

### 💰 Custos de Gas (estimados em USDC)
- **Criar Post:** ~0.01 USDC
- **Curtir Post:** ~0.001 USDC
- **Comentar:** ~0.005 USDC
- **Compartilhar:** ~0.002 USDC

### 📍 Endereço Atual
```
0xB48AF341BceF5573D9FBDf13e13309ED85450375
```

### 🔗 Explorer
https://testnet.arcscan.app/address/0xB48AF341BceF5573D9FBDf13e13309ED85450375

### 📂 Arquivos Relacionados
- **Contrato:** `contracts/SocialFeed.sol`
- **ABI/Integração:** `lib/social-contract.ts`
- **Funções de Interação:** `lib/blockchain-social.ts`
- **Script de Deploy:** `scripts/deploy-social-feed.js`

---

## 🚀 Como Fazer Deploy dos Contratos

### Pré-requisitos

1. **Node.js 18+** instalado
2. **USDC na Arc Network Testnet** (para gas fees)
   - Faucet: https://easyfaucetarc.xyz/
3. **Chave privada** da carteira com USDC

### Passo 1: Configurar Variáveis de Ambiente

Crie/edite `.env.local`:
```env
PRIVATE_KEY=sua_chave_privada_aqui
ARCNET_RPC_URL=https://rpc.testnet.arc.network
```

### Passo 2: Instalar Dependências

```bash
npm install
```

### Passo 3: Compilar Contratos

```bash
npm run compile
```

### Passo 4: Deploy dos Contratos

#### Opção A: Deploy de Ambos os Contratos
```bash
npm run deploy:contracts
```

#### Opção B: Deploy Individual
```bash
# Deploy ArcnetNostr
npm run deploy:arcnet-nostr

# Deploy SocialFeed
npm run deploy:social-feed
```

### Passo 5: Atualizar Endereços

Após o deploy, atualize `.env.local`:
```env
NEXT_PUBLIC_CONTRACT_ADDRESS=0x... (endereço do ArcnetNostr)
NEXT_PUBLIC_SOCIAL_CONTRACT_ADDRESS=0x... (endereço do SocialFeed)
```

---

## 🔗 Integração no Frontend

### ArcnetNostr

**Arquivo:** `lib/contract.ts`

```typescript
import { getContract, registerEventOnChain } from '@/lib/contract'

// Registrar evento
const txHash = await registerEventOnChain(provider, eventId, ipfsUri)

// Verificar se evento existe
const exists = await isEventRegistered(provider, eventId)
```

### SocialFeed

**Arquivo:** `lib/blockchain-social.ts`

```typescript
import { 
  createPostOnChain, 
  getAllPostsFromChain,
  likePostOnChain,
  commentOnChain 
} from '@/lib/blockchain-social'

// Criar post
const txHash = await createPostOnChain(content, mediaUrls)

// Obter todos os posts
const posts = await getAllPostsFromChain()

// Curtir post
await likePostOnChain(postId)
```

---

## 📊 Status dos Contratos

### ✅ Contratos Deployados

| Contrato | Endereço | Status | Explorer |
|----------|----------|--------|----------|
| **ArcnetNostr** | `0xe22C09345E1c8DF663143B5e931AcaCFd814182B` | ✅ Ativo | [Ver](https://testnet.arcscan.app/address/0xe22C09345E1c8DF663143B5e931AcaCFd814182B) |
| **SocialFeed** | `0xB48AF341BceF5573D9FBDf13e13309ED85450375` | ✅ Ativo | [Ver](https://testnet.arcscan.app/address/0xB48AF341BceF5573D9FBDf13e13309ED85450375) |

### 📝 Versões

- **Solidity:** 0.8.19 (SocialFeed) / 0.8.20 (ArcnetNostr)
- **Rede:** Arc Network Testnet (Chain ID: 5042002)
- **Gas Token:** USDC
- **Gas Price Mínimo:** 160 Gwei

---

## 🔐 Segurança

### Características de Segurança:

✅ **Sem controle centralizado** - Totalmente descentralizado
✅ **Conteúdo em IPFS/Arweave** - Resistente à censura
✅ **Transparência blockchain** - Todos os dados são públicos
✅ **Funções payable** - Cobre custos de gas em USDC
✅ **Validações** - Verificações de existência e permissões

### Considerações:

⚠️ **Endereços públicos** - Todos os endereços de carteira são públicos
⚠️ **Conteúdo imutável** - Posts não podem ser deletados
⚠️ **Gas fees** - Todas as interações custam USDC

---

## 🔮 Melhorias Futuras

- [ ] NFT minting para posts virais
- [ ] Sistema de recompensas em tokens
- [ ] Moderação via governança comunitária
- [ ] Customização de perfis com metadata
- [ ] Sistema de reputação on-chain
- [ ] Paginação para posts (otimização de gas)

---

## 📚 Recursos Adicionais

- **Documentação Arc Network:** https://docs.arc.network
- **Explorer:** https://testnet.arcscan.app
- **Faucet:** https://easyfaucetarc.xyz/
- **RPC:** https://rpc.testnet.arc.network

---

## 🆘 Troubleshooting

### Erro: "Insufficient funds"
**Solução:** Obtenha USDC no faucet: https://easyfaucetarc.xyz/

### Erro: "Contract address not configured"
**Solução:** Configure as variáveis de ambiente no `.env.local`

### Erro: "Post does not exist"
**Solução:** Verifique se o `postId` está correto e se o post foi criado

### Gas Price muito baixo
**Solução:** Arc Network requer mínimo de 160 Gwei. Configure no `hardhat.config.js`

---

## 📝 Notas Importantes

1. **Endereços Hardcoded:** Os contratos têm endereços fallback nos arquivos `lib/contract.ts` e `lib/social-contract.ts`
2. **Variáveis de Ambiente:** Sempre use variáveis de ambiente para endereços em produção
3. **Gas Fees:** Todas as transações custam USDC (não ETH)
4. **Testnet:** Contratos estão na testnet - não use em produção sem auditoria

---

## ✅ Checklist de Deploy

- [ ] USDC na carteira (para gas)
- [ ] `.env.local` configurado com `PRIVATE_KEY`
- [ ] Contratos compilados (`npm run compile`)
- [ ] Deploy executado (`npm run deploy:contracts`)
- [ ] Endereços atualizados no `.env.local`
- [ ] Frontend atualizado com novos endereços
- [ ] Testes realizados na aplicação

---

**Última atualização:** Contratos deployados e funcionando na Arc Network Testnet ✅

