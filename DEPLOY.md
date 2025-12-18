# Guia de Deploy do Arcnet Nostr DApp

Este guia explica como fazer o deploy completo do dApp, incluindo o smart contract.

## 📋 Pré-requisitos

1. **Node.js 18+** instalado
2. **MetaMask** ou outra carteira Ethereum
3. **Acesso à Arcnet Testnet** da Circle
4. **Hardhat** ou **Foundry** para deploy de contratos (opcional)

## 🚀 Deploy do Frontend

### 1. Instalar Dependências

```bash
npm install
```

### 2. Configurar Variáveis de Ambiente

Crie um arquivo `.env.local` na raiz do projeto:

```env
# Arcnet Network
NEXT_PUBLIC_ARCNET_RPC=https://testnet.arc.xyz/rpc

# Relay WebSocket (opcional)
NEXT_PUBLIC_RELAY_WS=wss://seu-relay.com/ws

# IPFS/Pinata (opcional)
NEXT_PUBLIC_PINATA_API_KEY=sua_api_key
NEXT_PUBLIC_PINATA_SECRET_KEY=sua_secret_key

# Smart Contract (após deploy)
NEXT_PUBLIC_CONTRACT_ADDRESS=0x...
```

### 3. Executar em Desenvolvimento

```bash
npm run dev
```

### 4. Build para Produção

```bash
npm run build
npm start
```

## 🔷 Deploy do Smart Contract

### Opção 1: Usando Hardhat

1. **Instalar Hardhat**:

```bash
npm install --save-dev hardhat @nomicfoundation/hardhat-toolbox
```

2. **Criar `hardhat.config.js`**:

```javascript
require("@nomicfoundation/hardhat-toolbox");

module.exports = {
  solidity: "0.8.20",
  networks: {
    arcnet: {
      url: process.env.ARCNET_RPC_URL || "https://rpc.testnet.arc.network",
      accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [],
      chainId: 5042002, // Official Arc Testnet Chain ID
    },
  },
};
```

3. **Criar script de deploy** (`scripts/deploy.js`):

```javascript
const hre = require("hardhat");

async function main() {
  const ArcnetNostr = await hre.ethers.getContractFactory("ArcnetNostr");
  const contract = await ArcnetNostr.deploy();

  await contract.waitForDeployment();

  console.log("ArcnetNostr deployed to:", await contract.getAddress());
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
```

4. **Deploy**:

```bash
npx hardhat run scripts/deploy.js --network arcnet
```

5. **Atualizar `.env.local`** com o endereço do contrato:

```env
NEXT_PUBLIC_CONTRACT_ADDRESS=0x...
```

### Opção 2: Usando Remix IDE

1. Acesse [Remix IDE](https://remix.ethereum.org)
2. Crie um novo arquivo `ArcnetNostr.sol` e cole o código do contrato
3. Compile o contrato (Solidity 0.8.20)
4. Na aba "Deploy & Run":
   - Selecione "Injected Provider - MetaMask"
   - Certifique-se de estar na rede Arcnet testnet
   - Clique em "Deploy"
   - Copie o endereço do contrato

## 🔧 Configuração da Rede Arcnet

### Adicionar Rede ao MetaMask

O dApp tenta adicionar automaticamente, mas você pode adicionar manualmente:

1. Abra MetaMask
2. Clique no menu de redes
3. "Adicionar Rede"
4. Preencha:
   - **Nome da Rede**: Arc Testnet
   - **RPC URL**: `https://rpc.testnet.arc.network`
   - **Chain ID**: `5042002` (0x4D0A2 em hex)
   - **Símbolo da Moeda**: USDC
   - **Decimais**: 18
   - **URL do Block Explorer**: `https://testnet.arcscan.app`

### Obter Tokens de Teste

1. Acesse o faucet oficial da Circle Arc testnet
2. Solicite USDC de teste
3. Use para pagar taxas de transação

## 📦 Configuração de IPFS (Opcional)

### Usando Pinata

1. Crie uma conta em [Pinata](https://pinata.cloud)
2. Obtenha suas chaves API
3. Adicione ao `.env.local`:

```env
NEXT_PUBLIC_PINATA_API_KEY=sua_chave
NEXT_PUBLIC_PINATA_SECRET_KEY=sua_secret
```

### Usando IPFS Local

Para desenvolvimento, o mock funciona automaticamente.

## 🌐 Deploy em Produção

### Vercel (Recomendado)

1. **Conecte seu repositório** ao Vercel
2. **Configure variáveis de ambiente** no painel da Vercel
3. **Deploy automático** a cada push

### Outras Plataformas

- **Netlify**: Similar ao Vercel
- **AWS Amplify**: Suporta Next.js
- **Self-hosted**: Use `npm run build && npm start`

## ✅ Checklist de Deploy

- [ ] Dependências instaladas
- [ ] Variáveis de ambiente configuradas
- [ ] Rede Arcnet adicionada ao MetaMask
- [ ] Tokens de teste obtidos
- [ ] Smart contract deployado (opcional)
- [ ] Endereço do contrato configurado
- [ ] IPFS configurado (opcional)
- [ ] Build de produção testado
- [ ] Deploy realizado
- [ ] Funcionalidades testadas

## 🐛 Troubleshooting

### Erro: "Network not found"
- Verifique se a rede Arcnet está adicionada ao MetaMask
- Confirme o Chain ID correto

### Erro: "Insufficient funds"
- Obtenha USDC de teste do faucet

### Erro: "Contract not found"
- Verifique se o contrato foi deployado
- Confirme o endereço em `NEXT_PUBLIC_CONTRACT_ADDRESS`

### IPFS não funciona
- Verifique as credenciais do Pinata
- O mock funciona sem configuração

## 📚 Recursos

- [Arc Network Documentation](https://docs.arc.network)
- [Connect to Arc](https://docs.arc.network/arc/references/connect-to-arc)
- [Gas and Fees](https://docs.arc.network/arc/references/gas-and-fees)
- [Deploy on Arc](https://docs.arc.network/arc/tutorials/deploy-on-arc)
- [Next.js Deployment](https://nextjs.org/docs/deployment)
- [Hardhat Documentation](https://hardhat.org/docs)
- [Pinata Documentation](https://docs.pinata.cloud)

---

**Nota**: Este é um guia básico. Ajuste conforme suas necessidades específicas.

