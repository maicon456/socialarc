# 🚀 Instruções de Deploy no Vercel

## Opção 1: Deploy via Dashboard do Vercel (RECOMENDADO)

### Passo 1: Acesse o Vercel
1. Acesse https://vercel.com
2. Faça login com sua conta (GitHub, GitLab, ou email)

### Passo 2: Importar Projeto
1. Clique em **"Add New..."** > **"Project"**
2. Selecione o repositório `maicon456/socialarc`
3. O Vercel detectará automaticamente:
   - Framework: Next.js
   - Package Manager: pnpm (detecta `pnpm-lock.yaml`)
   - Build Command: `pnpm run build`

### Passo 3: Configurar Variáveis de Ambiente
Na tela de configuração do projeto, adicione:

**Environment Variables:**
- `NEXT_PUBLIC_ARCNET_RPC` = `https://rpc.testnet.arc.network`
- `NEXT_PUBLIC_ARCNET_CHAIN_ID` = `0x4D0A2`

**Opcionais (se já tem contratos):**
- `NEXT_PUBLIC_CONTRACT_ADDRESS`
- `NEXT_PUBLIC_SOCIAL_CONTRACT_ADDRESS`

### Passo 4: Deploy
1. Clique em **"Deploy"**
2. Aguarde o build completar
3. ✅ Pronto! Seu projeto estará no ar!

---

## Opção 2: Deploy via CLI do Vercel

### Passo 1: Login
```powershell
vercel login
```
Siga as instruções na tela para autenticar.

### Passo 2: Deploy
```powershell
vercel --prod
```

Ou use o script automatizado:
```powershell
.\deploy-vercel.ps1
```

---

## ⚠️ IMPORTANTE: Antes do Deploy

### 1. Commit e Push das Alterações
```bash
git add .
git commit -m "Fix: Configuração completa para deploy no Vercel"
git push origin main
```

### 2. Verificar Build Local
```bash
npm run build
```
Deve completar sem erros.

---

## ✅ Verificações Pós-Deploy

### 1. Verificar Logs
No dashboard do Vercel, verifique os logs:
- ✅ Deve aparecer: `> next build --webpack`
- ✅ Build deve completar sem erros
- ✅ Não deve haver erros de Turbopack

### 2. Testar Aplicação
- Acesse a URL fornecida pelo Vercel
- Teste a conexão de carteira
- Verifique se as transações funcionam

### 3. Configurar Domínio (Opcional)
- Settings > Domains
- Adicione seu domínio customizado

---

## 🔧 Troubleshooting

### Erro: "Turbopack/Webpack"
**Solução:** O `package.json` já está configurado com `--webpack`. Certifique-se de que o código foi commitado e pushado.

### Erro: "Build failed"
**Solução:**
1. Verifique os logs completos no Vercel
2. Limpe o cache: Settings > General > "Clear Build Cache"
3. Faça um novo deploy

### Erro: "Environment variables missing"
**Solução:** Configure as variáveis de ambiente no dashboard do Vercel (Settings > Environment Variables)

---

## 📝 Checklist Final

- [ ] Código commitado e pushado para GitHub
- [ ] Build local funcionando (`npm run build`)
- [ ] Variáveis de ambiente configuradas no Vercel
- [ ] Deploy iniciado (via dashboard ou CLI)
- [ ] Logs verificados (sem erros)
- [ ] Aplicação testada na URL do Vercel

---

## 🎉 Pronto!

Após seguir estes passos, seu projeto estará deployado e funcionando no Vercel!

