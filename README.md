# Arcnet Nostr-like DApp

Um aplicativo descentralizado (dApp) inspirado no protocolo Nostr, construído para a rede Arcnet testnet. Este projeto implementa uma rede social descentralizada onde as publicações são assinadas com carteiras Ethereum e podem ser armazenadas em IPFS.

## 🚀 Tecnologias

- **Next.js 14** - Framework React com App Router
- **TypeScript** - Tipagem estática
- **Tailwind CSS** - Estilização
- **Framer Motion** - Animações
- **ethers.js** - Interação com blockchain
- **Lucide React** - Ícones

## 📋 Pré-requisitos

- Node.js 18+ instalado
- npm ou yarn
- MetaMask ou outra carteira Ethereum compatível

## 🛠️ Instalação

1. **Navegue até o diretório do projeto:**
   ```bash
   cd arcnet-nostr-dapp
   ```

2. **Instale as dependências:**
   ```bash
   npm install
   # ou
   yarn install
   ```

3. **Execute o servidor de desenvolvimento:**
   ```bash
   npm run dev
   # ou
   yarn dev
   ```

4. **Abra o navegador em:**
   ```
   http://localhost:3000
   ```

## 📁 Estrutura do Projeto

```
arcnet-nostr-dapp/
├── app/
│   ├── globals.css      # Estilos globais
│   ├── layout.tsx       # Layout principal
│   └── page.tsx         # Página inicial
├── components/
│   ├── Sidebar.tsx      # Barra lateral esquerda
│   ├── PostComposer.tsx # Componente de criação de posts
│   ├── Feed.tsx         # Feed de publicações
│   └── RightSidebar.tsx # Barra lateral direita
├── lib/
│   ├── config.ts        # Configurações (RPC, Relay, etc)
│   ├── ipfs.ts          # Funções de IPFS (mock)
│   ├── wallet.ts        # Funções de carteira
│   ├── events.ts        # Schema e funções de eventos
│   └── relay.ts         # Classe MockRelay
├── types/
│   └── window.d.ts      # Tipos TypeScript para window.ethereum
└── package.json
```

## 🔧 Configuração

### Configurar Rede Arcnet Testnet

O dApp está configurado para conectar automaticamente à rede Arcnet testnet da Circle. 

**⚠️ IMPORTANTE**: Você precisa atualizar os valores oficiais da rede em `lib/network.ts`:

1. **Obtenha as informações oficiais**:
   - Visite https://www.circle.com/en/arc
   - Registre-se para acesso à testnet
   - Obtenha o Chain ID e RPC URL oficiais

2. **Atualize `lib/network.ts`**:
   ```typescript
   export const ARCNET_TESTNET: NetworkConfig = {
     chainId: '0x...', // Chain ID oficial
     chainName: 'Circle Arc Testnet',
     nativeCurrency: {
       name: 'USDC',
       symbol: 'USDC',
       decimals: 6,
     },
     rpcUrls: ['https://rpc-oficial.arc.xyz'],
     blockExplorerUrls: ['https://explorer-oficial.arc.xyz'],
   };
   ```

3. **O dApp irá**:
   - Adicionar automaticamente a rede ao MetaMask ao conectar
   - Trocar para a rede Arcnet testnet automaticamente
   - Mostrar status visual da rede conectada

Consulte `ARCNET_SETUP.md` para instruções detalhadas.

### Configurar Relay WebSocket

Edite `lib/config.ts` ou use variáveis de ambiente:

```typescript
export const MOCK_RELAY_WS = process.env.NEXT_PUBLIC_RELAY_WS || 'wss://mock-relay.example/ws';
```

### Implementar IPFS Real (Opcional)

Para usar IPFS real (ex: Pinata), edite `lib/ipfs.ts`:

1. Obtenha suas chaves da API do Pinata
2. Descomente e configure o código de upload real
3. Adicione as variáveis de ambiente no `.env.local`:

```env
NEXT_PUBLIC_PINATA_API_KEY=your_api_key
NEXT_PUBLIC_PINATA_SECRET_KEY=your_secret_key
```

## 🎯 Funcionalidades

- ✅ Conexão com carteira Ethereum (MetaMask)
- ✅ **Conexão automática com Arcnet testnet da Circle**
- ✅ **Detecção e troca automática de rede**
- ✅ **Indicador visual de status da rede**
- ✅ Criação de posts assinados
- ✅ Feed de publicações em tempo real
- ✅ Sistema de likes (reactions)
- ✅ Armazenamento local (localStorage)
- ✅ Interface responsiva e moderna
- ✅ Animações suaves com Framer Motion

## 🔮 Próximos Passos

Para produção, você precisará:

1. **✅ Integrar com Arcnet** - ✅ CONCLUÍDO - Configuração de rede implementada
2. **Atualizar valores oficiais** - Substituir valores placeholder em `lib/network.ts` com dados oficiais da Circle
3. **Implementar IPFS real** - Substituir mocks por upload real
4. **Configurar Relay WebSocket** - Implementar servidor relay real
5. **Smart Contracts** - Opcionalmente, criar contratos para registro on-chain
6. **Autenticação** - Melhorar sistema de autenticação
7. **Criptografia** - Adicionar criptografia end-to-end
8. **Testar com USDC** - Verificar funcionamento com USDC como token de gás

## 📝 Scripts Disponíveis

- `npm run dev` - Inicia servidor de desenvolvimento
- `npm run build` - Cria build de produção
- `npm run start` - Inicia servidor de produção
- `npm run lint` - Executa linter

## 🤝 Contribuindo

Este é um projeto de exemplo/scaffold. Sinta-se livre para modificar e adaptar conforme suas necessidades.

## 📄 Licença

Este projeto é fornecido como está, para fins educacionais e de desenvolvimento.

## ⚠️ Nota Importante

Este projeto usa funções **MOCK** para demonstração. Antes de usar em produção, você deve:

- Substituir todas as funções mock por implementações reais
- Configurar endpoints reais de RPC e Relay
- Implementar upload real para IPFS
- Adicionar tratamento de erros robusto
- Implementar testes
- Adicionar validação de dados

---

Desenvolvido com ❤️ para a comunidade Web3

