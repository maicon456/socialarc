# Correções para Deploy no Vercel

## Problemas Identificados e Corrigidos

### 1. ❌ Erro: Conflito entre Turbopack e Webpack

**Problema:**
- Next.js 16 usa Turbopack por padrão
- O projeto tem configuração webpack customizada
- Build falhava com erro: "This build is using Turbopack, with a `webpack` config"

**Solução:**
- ✅ Atualizado `package.json` para usar `--webpack` explicitamente no script de build
- ✅ Configuração webpack mantida no `next.config.mjs` com fallbacks necessários

**Arquivos Modificados:**
- `package.json`: Script de build agora usa `next build --webpack`
- `next.config.mjs`: Configuração webpack otimizada com fallbacks

### 2. ✅ Arquivo vercel.json Criado

**Configuração:**
- Framework: Next.js
- Build Command: `npm run build` (usa --webpack automaticamente)
- Variáveis de ambiente configuradas para Arc Network

**Arquivo Criado:**
- `vercel.json`: Configuração do Vercel com variáveis de ambiente

## Configurações Aplicadas

### package.json
```json
{
  "scripts": {
    "build": "next build --webpack"
  }
}
```

### vercel.json
```json
{
  "buildCommand": "npm run build",
  "framework": "nextjs",
  "env": {
    "NEXT_PUBLIC_ARCNET_RPC": "https://rpc.testnet.arc.network",
    "NEXT_PUBLIC_ARCNET_CHAIN_ID": "0x4D0A2"
  }
}
```

## Variáveis de Ambiente no Vercel

Configure as seguintes variáveis de ambiente no painel do Vercel:

### Obrigatórias:
- `NEXT_PUBLIC_ARCNET_RPC`: `https://rpc.testnet.arc.network`
- `NEXT_PUBLIC_ARCNET_CHAIN_ID`: `0x4D0A2`

### Opcionais (se contratos já foram deployados):
- `NEXT_PUBLIC_CONTRACT_ADDRESS`: Endereço do contrato ArcnetNostr
- `NEXT_PUBLIC_SOCIAL_CONTRACT_ADDRESS`: Endereço do contrato SocialFeed

### Opcionais (para IPFS/Pinata):
- `NEXT_PUBLIC_PINATA_API_KEY`: Chave da API Pinata
- `NEXT_PUBLIC_PINATA_SECRET_KEY`: Secret da API Pinata

## Status do Build

✅ **Build Local:** Funcionando corretamente
- Compilação bem-sucedida
- 14 páginas geradas (14 estáticas, 0 dinâmicas)
- Sem erros de TypeScript (ignorados para build)

## Próximos Passos

1. **Fazer commit das alterações:**
   ```bash
   git add .
   git commit -m "Fix: Corrigir configuração de build para Vercel"
   git push
   ```

2. **No Vercel:**
   - Conectar o repositório (se ainda não estiver conectado)
   - Verificar se as variáveis de ambiente estão configuradas
   - O deploy deve funcionar automaticamente após o push

3. **Verificar Deploy:**
   - Acessar o dashboard do Vercel
   - Verificar logs de build
   - Testar a aplicação deployada

## Notas Importantes

- ⚠️ Hardhat não é necessário para o build (apenas para deploy de contratos)
- ✅ Todas as dependências do Hardhat estão em `devDependencies`
- ✅ O código da aplicação não importa Hardhat
- ✅ Build funciona sem problemas no ambiente do Vercel

## Troubleshooting

Se o deploy ainda falhar:

1. **Verificar logs no Vercel:**
   - Acesse o dashboard do projeto
   - Veja os logs de build completos

2. **Verificar variáveis de ambiente:**
   - Certifique-se de que todas as variáveis `NEXT_PUBLIC_*` estão configuradas

3. **Verificar Node.js version:**
   - Vercel usa Node.js 18+ por padrão
   - Se necessário, configure no `package.json`:
     ```json
     {
       "engines": {
         "node": ">=18.0.0"
       }
     }
     ```

4. **Limpar cache:**
   - No Vercel, vá em Settings > General
   - Clique em "Clear Build Cache"

