# Configuração da Rede Arc Testnet

Este documento explica como configurar a conexão com a rede Arc testnet oficial.

## 🔗 Informações da Rede (Valores Oficiais)

### Configuração Oficial da Arc Testnet

- **Nome da Rede**: Arc Testnet
- **Chain ID**: `0x4D0A2` (5042002 em decimal)
- **Moeda Nativa**: USDC
- **Decimais**: 18 (USDC como token nativo para gas)
- **RPC URL**: `https://rpc.testnet.arc.network`
- **Block Explorer**: `https://testnet.arcscan.app`
- **Faucet**: `https://faucet.circle.com`

**Fonte**: [Arc Network Documentation](https://docs.arc.network/arc/references/connect-to-arc)

## 📝 Documentação Oficial

1. **Documentação da Arc Network**:
   - Site oficial: https://arc.network
   - Documentação: https://docs.arc.network
   - Connect to Arc: https://docs.arc.network/arc/references/connect-to-arc

2. **Recursos Úteis**:
   - Faucet: https://faucet.circle.com (para obter USDC de teste)
   - Block Explorer: https://testnet.arcscan.app
   - Gas and Fees: https://docs.arc.network/arc/references/gas-and-fees

## 🔧 Configuração Manual

### 1. Atualizar `lib/network.ts`

Edite o arquivo `lib/network.ts` e atualize os valores:

```typescript
export const ARCNET_TESTNET: NetworkConfig = {
  chainId: '0x4D0A2', // 5042002 em decimal - Chain ID oficial
  chainName: 'Arc Testnet',
  nativeCurrency: {
    name: 'USDC',
    symbol: 'USDC',
    decimals: 18, // USDC no Arc usa 18 decimais (token nativo para gas)
  },
  rpcUrls: [
    'https://rpc.testnet.arc.network', // RPC oficial
  ],
  blockExplorerUrls: [
    'https://testnet.arcscan.app', // Explorer oficial
  ],
};
```

### 2. Adicionar Variáveis de Ambiente (Opcional)

Crie um arquivo `.env.local`:

```env
NEXT_PUBLIC_ARCNET_RPC=https://rpc.testnet.arc.network
NEXT_PUBLIC_RELAY_WS=wss://seu-relay.com/ws
```

### 3. Adicionar Rede ao MetaMask Manualmente

Se preferir adicionar manualmente:

1. Abra MetaMask
2. Clique no menu de redes (topo)
3. Clique em "Adicionar Rede"
4. Preencha com os dados da rede Arcnet testnet
5. Salve

## ✅ Funcionalidades Implementadas

- ✅ Detecção automática da rede conectada
- ✅ Troca automática para Arcnet testnet ao conectar carteira
- ✅ Indicador visual de status da rede
- ✅ Botão para trocar de rede manualmente
- ✅ Suporte para USDC como token de gás

## 🧪 Testando a Conexão

1. **Conecte sua carteira**:
   - Clique em "Conectar carteira"
   - A rede será automaticamente trocada para Arcnet testnet

2. **Verifique o status**:
   - Um indicador verde aparecerá se estiver na rede correta
   - Um aviso amarelo aparecerá se estiver em outra rede

3. **Teste funcionalidades**:
   - Crie um post
   - Verifique se as transações funcionam
   - Confirme que está usando USDC para gas

## ⚠️ Notas Importantes

- **USDC como Gas**: A Arc usa USDC como token nativo para taxas de transação (18 decimais)
- **Gas Fees**: Base fee mínimo de ~160 Gwei (~$0.01 por transação na testnet)
- **Finalidade Determinística**: Transações são finalizadas em menos de 1 segundo
- **Testnet**: Esta é uma rede de testes - não use tokens reais
- **Faucet**: Obtenha USDC de teste em https://faucet.circle.com
- **Atualizações**: Verifique regularmente a documentação oficial para atualizações

## 🔗 Links Úteis

- [Arc Network Website](https://arc.network)
- [Arc Documentation](https://docs.arc.network)
- [Connect to Arc](https://docs.arc.network/arc/references/connect-to-arc)
- [Gas and Fees](https://docs.arc.network/arc/references/gas-and-fees)
- [Deploy on Arc](https://docs.arc.network/arc/tutorials/deploy-on-arc)
- [Block Explorer](https://testnet.arcscan.app)
- [Faucet](https://faucet.circle.com)

## 📞 Suporte

Se encontrar problemas:

1. Verifique se os valores em `lib/network.ts` estão corretos
2. Confirme que você tem acesso à testnet
3. Verifique a documentação oficial da Circle
4. Entre em contato com o suporte da Circle Arc

---

**Última atualização**: Configurado com valores oficiais da Arc Network (2024).










