# ⚡ DEPLOY RÁPIDO - 3 PASSOS

## 🎯 Método Mais Rápido: Dashboard do Vercel

### Passo 1: Acesse
👉 https://vercel.com/new

### Passo 2: Importe o Repositório
1. Selecione: `maicon456/socialarc`
2. Clique em "Import"

### Passo 3: Configure e Deploy
1. **Environment Variables** (adicione):
   ```
   NEXT_PUBLIC_ARCNET_RPC = https://rpc.testnet.arc.network
   NEXT_PUBLIC_ARCNET_CHAIN_ID = 0x4D0A2
   ```

2. Clique em **"Deploy"**

3. Aguarde ~2 minutos

4. ✅ **PRONTO!** Seu app estará no ar!

---

## 🔄 Deploy Automático

Após o primeiro deploy, **todos os pushes no GitHub** farão deploy automático!

```bash
git push origin main  # ← Deploy automático!
```

---

## 📱 URL do Projeto

Após o deploy, você terá uma URL como:
- `https://socialarc-xxxxx.vercel.app`

Você pode configurar um domínio customizado depois em:
**Settings > Domains**

---

## ✅ Tudo Pronto!

O projeto está 100% configurado. Basta importar no Vercel e fazer deploy!

