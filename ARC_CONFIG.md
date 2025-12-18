# Configuração Oficial da Arc Network

Este documento contém as configurações oficiais da rede Arc Testnet conforme a documentação em [docs.arc.network](https://docs.arc.network).

## 🔗 Informações da Rede Arc Testnet

### Parâmetros Oficiais

| Parâmetro | Valor |
|-----------|-------|
| **Nome da Rede** | Arc Testnet |
| **Chain ID (Decimal)** | 5042002 |
| **Chain ID (Hex)** | 0x4D0A2 |
| **RPC URL** | https://rpc.testnet.arc.network |
| **Block Explorer** | https://testnet.arcscan.app |
| **Faucet** | https://faucet.circle.com |
| **Moeda Nativa** | USDC |
| **Decimais** | 18 |

### Características da Rede

- **Token de Gas**: USDC (18 decimais)
- **Base Fee Mínimo**: ~160 Gwei (~$0.01 por transação na testnet)
- **Finalidade**: Determinística em menos de 1 segundo
- **Compatibilidade**: EVM completa
- **Consenso**: Malachite (BFT)

## 📝 Configuração no MetaMask

### Adicionar Rede Manualmente

1. Abra o MetaMask
2. Clique no menu de redes (topo)
3. Selecione "Adicionar rede" → "Adicionar uma rede manualmente"
4. Preencha com os seguintes valores:

```
Nome da Rede: Arc Testnet
Nova URL do RPC: https://rpc.testnet.arc.network
ID da Cadeia: 5042002
Símbolo da Moeda: USDC
URL do Explorador de Blocos: https://testnet.arcscan.app
```

5. Clique em "Salvar"

## 🔧 Configuração no Código

### TypeScript/JavaScript

```typescript
const ARCNET_TESTNET = {
  chainId: '0x4D0A2', // 5042002 em decimal
  chainName: 'Arc Testnet',
  nativeCurrency: {
    name: 'USDC',
    symbol: 'USDC',
    decimals: 18,
  },
  rpcUrls: ['https://rpc.testnet.arc.network'],
  blockExplorerUrls: ['https://testnet.arcscan.app'],
};
```

### Hardhat

```javascript
module.exports = {
  networks: {
    arcnet: {
      url: "https://rpc.testnet.arc.network",
      chainId: 5042002,
      accounts: [process.env.PRIVATE_KEY],
    },
  },
};
```

### Foundry

```bash
# .env
ARC_TESTNET_RPC_URL="https://rpc.testnet.arc.network"
PRIVATE_KEY="sua_chave_privada"

# Deploy
forge create src/Contract.sol:Contract \
  --rpc-url $ARC_TESTNET_RPC_URL \
  --private-key $PRIVATE_KEY \
  --broadcast
```

## 💰 Obter USDC de Teste

1. Acesse o [Circle Faucet](https://faucet.circle.com)
2. Conecte sua carteira
3. Solicite USDC de teste
4. Use para pagar taxas de transação

## 📊 Gas e Taxas

### Informações sobre Gas

- **Unidade**: USDC (18 decimais)
- **Base Fee (testnet)**: ~160 Gwei mínimo
- **Custo por Transação**: ~$0.01 na testnet
- **Política**: Taxa base ajustada dinamicamente

**Importante**: Transações com taxa máxima abaixo de 160 Gwei podem permanecer pendentes ou falhar.

## 🔗 Links Úteis

- **Documentação**: https://docs.arc.network
- **Connect to Arc**: https://docs.arc.network/arc/references/connect-to-arc
- **Gas and Fees**: https://docs.arc.network/arc/references/gas-and-fees
- **Deploy on Arc**: https://docs.arc.network/arc/tutorials/deploy-on-arc
- **Block Explorer**: https://testnet.arcscan.app
- **Faucet**: https://faucet.circle.com

## ✅ Checklist de Configuração

- [ ] MetaMask configurado com Arc Testnet
- [ ] Chain ID correto (5042002)
- [ ] RPC URL configurado
- [ ] USDC de teste obtido do faucet
- [ ] Código atualizado com valores oficiais
- [ ] Testes realizados na testnet

---

**Última atualização**: Baseado na documentação oficial da Arc Network (2024)
**Fonte**: [docs.arc.network](https://docs.arc.network)




