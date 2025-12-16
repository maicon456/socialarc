# Configuração da Rede Arcnet Testnet

Este documento explica como configurar a conexão com a rede Arcnet testnet da Circle.

## 🔗 Informações da Rede

### Configuração Atual (Atualizar com valores oficiais)

- **Nome da Rede**: Circle Arc Testnet
- **Chain ID**: `0x1A4` (420 em decimal) - **ATUALIZAR COM VALOR OFICIAL**
- **Moeda Nativa**: USDC (6 decimais)
- **RPC URL**: `https://testnet.arc.xyz/rpc` - **ATUALIZAR COM URL OFICIAL**
- **Block Explorer**: `https://testnet-explorer.arc.xyz` - **ATUALIZAR COM URL OFICIAL**

## 📝 Como Obter Informações Oficiais

1. **Visite a documentação oficial da Circle Arc**:
   - Site: https://www.circle.com/en/arc
   - Portal de desenvolvedores: https://developers.circle.com/arc

2. **Registre-se para acesso à testnet**:
   - Obtenha credenciais de acesso
   - Receba informações sobre RPC endpoints
   - Obtenha o Chain ID oficial

3. **Atualize os arquivos de configuração**:
   - `lib/network.ts` - Atualize `ARCNET_TESTNET` com valores oficiais
   - `lib/config.ts` - Atualize `ARCNET_RPC` se necessário

## 🔧 Configuração Manual

### 1. Atualizar `lib/network.ts`

Edite o arquivo `lib/network.ts` e atualize os valores:

```typescript
export const ARCNET_TESTNET: NetworkConfig = {
  chainId: '0x...', // Chain ID oficial em hex
  chainName: 'Circle Arc Testnet',
  nativeCurrency: {
    name: 'USDC',
    symbol: 'USDC',
    decimals: 6,
  },
  rpcUrls: [
    'https://rpc-url-oficial.arc.xyz', // RPC oficial
  ],
  blockExplorerUrls: [
    'https://explorer-oficial.arc.xyz', // Explorer oficial
  ],
};
```

### 2. Adicionar Variáveis de Ambiente (Opcional)

Crie um arquivo `.env.local`:

```env
NEXT_PUBLIC_ARCNET_RPC=https://rpc-url-oficial.arc.xyz
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

- **USDC como Gas**: A Arcnet usa USDC como token nativo para taxas de transação
- **Testnet**: Esta é uma rede de testes - não use tokens reais
- **Atualizações**: Verifique regularmente a documentação oficial para atualizações

## 🔗 Links Úteis

- [Circle Arc Website](https://www.circle.com/en/arc)
- [Circle Developers Portal](https://developers.circle.com/arc)
- [Documentação Arcnet](https://docs.arc.xyz) (quando disponível)

## 📞 Suporte

Se encontrar problemas:

1. Verifique se os valores em `lib/network.ts` estão corretos
2. Confirme que você tem acesso à testnet
3. Verifique a documentação oficial da Circle
4. Entre em contato com o suporte da Circle Arc

---

**Última atualização**: Aguardando informações oficiais da Circle sobre RPC endpoints e Chain ID.










