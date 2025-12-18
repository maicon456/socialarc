# Script de Deploy para Vercel
# Este script prepara o projeto e faz o deploy no Vercel

Write-Host "🚀 Preparando deploy para Vercel..." -ForegroundColor Cyan

# Verificar se está logado no Vercel
Write-Host "`n📋 Verificando login no Vercel..." -ForegroundColor Yellow
$vercelCheck = vercel whoami 2>&1
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Não está logado no Vercel. Fazendo login..." -ForegroundColor Red
    Write-Host "Por favor, siga as instruções na tela para fazer login." -ForegroundColor Yellow
    vercel login
    if ($LASTEXITCODE -ne 0) {
        Write-Host "❌ Falha no login. Por favor, faça login manualmente com: vercel login" -ForegroundColor Red
        exit 1
    }
}

Write-Host "✅ Logado no Vercel!" -ForegroundColor Green

# Verificar se há mudanças não commitadas
Write-Host "`n📋 Verificando mudanças no Git..." -ForegroundColor Yellow
$gitStatus = git status --short
if ($gitStatus) {
    Write-Host "⚠️  Há mudanças não commitadas:" -ForegroundColor Yellow
    Write-Host $gitStatus
    $commit = Read-Host "Deseja fazer commit antes do deploy? (s/n)"
    if ($commit -eq "s" -or $commit -eq "S") {
        git add .
        $message = Read-Host "Digite a mensagem do commit (ou pressione Enter para usar a padrão)"
        if ([string]::IsNullOrWhiteSpace($message)) {
            $message = "Deploy: Configuração completa para Vercel"
        }
        git commit -m $message
        Write-Host "✅ Commit realizado!" -ForegroundColor Green
    }
}

# Fazer deploy
Write-Host "`n🚀 Iniciando deploy no Vercel..." -ForegroundColor Cyan
Write-Host "Isso pode levar alguns minutos..." -ForegroundColor Yellow

vercel --prod

if ($LASTEXITCODE -eq 0) {
    Write-Host "`n✅ Deploy concluído com sucesso!" -ForegroundColor Green
    Write-Host "🌐 Seu projeto está no ar!" -ForegroundColor Cyan
} else {
    Write-Host "`n❌ Deploy falhou. Verifique os erros acima." -ForegroundColor Red
    exit 1
}

