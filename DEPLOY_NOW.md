# 🚀 DEPLOY AGORA - Guia Rápido

## ✅ Status Atual
- ✅ Código commitado e pushado
- ✅ Configurações do Vercel prontas
- ✅ Build local funcionando
- ✅ `vercel.json` configurado

## 🎯 Próximos Passos (ESCOLHA UMA OPÇÃO)

### OPÇÃO 1: Via Dashboard do Vercel (MAIS FÁCIL) ⭐

1. **Acesse:** https://vercel.com
2. **Login:** Use sua conta GitHub/GitLab
3. **Import Project:**
   - Clique em "Add New..." > "Project"
   - Selecione: `maicon456/socialarc`
   - Clique em "Import"

4. **Configure Environment Variables:**
   - Na tela de configuração, adicione:
     - `NEXT_PUBLIC_ARCNET_RPC` = `https://rpc.testnet.arc.network`
     - `NEXT_PUBLIC_ARCNET_CHAIN_ID` = `0x4D0A2`

5. **Deploy:**
   - Clique em "Deploy"
   - Aguarde ~2-3 minutos
   - ✅ Pronto!

---

### OPÇÃO 2: Via CLI (Terminal)

#### Se já está logado:
```powershell
vercel --prod
```

#### Se não está logado:
1. Execute: `vercel login`
2. Siga as instruções na tela
3. Execute: `vercel --prod`

---

## 📋 O que o Vercel vai fazer automaticamente:

1. ✅ Detectar Next.js
2. ✅ Usar pnpm (detecta `pnpm-lock.yaml`)
3. ✅ Executar `pnpm run build` (que usa `--webpack`)
4. ✅ Deploy automático

## ✅ Verificações nos Logs:

Quando o deploy iniciar, verifique nos logs:
- ✅ `> next build --webpack` (deve aparecer)
- ✅ Build completo sem erros
- ✅ URL gerada

## 🎉 Resultado:

Após o deploy, você terá:
- 🌐 URL pública (ex: `seu-projeto.vercel.app`)
- ✅ Aplicação funcionando
- ✅ Deploy automático a cada push no GitHub

---

## ⚡ COMANDO RÁPIDO:

Se já tem o projeto conectado no Vercel, basta fazer push:
```bash
git push origin main
```

O Vercel fará deploy automático!

