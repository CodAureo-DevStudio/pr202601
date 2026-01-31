# ============================================
# SCRIPT DE RESTAURAÇÃO AUTOMÁTICA
# Crystal Island Backup - 30/01/2026
# ============================================

Write-Host ""
Write-Host "═══════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host "  🔄 RESTAURAÇÃO CRYSTAL ISLAND BACKUP" -ForegroundColor Cyan
Write-Host "═══════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host ""

# Diretório de backup
$backupDir = "_backups_crystal_island"

# Lista de arquivos para restaurar
$files = @(
    "index.html",
    "quem-somos.html",
    "projetos.html",
    "galeria.html",
    "editais.html",
    "noticias.html",
    "doe-aqui.html",
    "fale-conosco.html"
)

# Confirmação
Write-Host "Este script irá restaurar as seguintes páginas:" -ForegroundColor Yellow
foreach ($file in $files) {
    Write-Host "  • $file" -ForegroundColor White
}
Write-Host ""

$confirmation = Read-Host "Deseja continuar? (S/N)"
if ($confirmation -ne "S" -and $confirmation -ne "s") {
    Write-Host ""
    Write-Host "❌ Restauração cancelada pelo usuário." -ForegroundColor Red
    Write-Host ""
    exit
}

Write-Host ""
Write-Host "🔄 Iniciando restauração..." -ForegroundColor Cyan
Write-Host ""

# Contadores
$restored = 0
$failed = 0

# Processar cada arquivo
foreach ($file in $files) {
    $backup = "$backupDir\$file.backup"
    
    if (Test-Path $backup) {
        try {
            # Criar backup da versão atual antes de substituir
            if (Test-Path $file) {
                $timestamp = Get-Date -Format "yyyyMMdd_HHmmss"
                Copy-Item $file "$backupDir\${file}_before_restore_${timestamp}.bak" -ErrorAction SilentlyContinue
            }
            
            # Restaurar do backup
            Copy-Item $backup $file -Force
            Write-Host "✅ Restaurado: $file" -ForegroundColor Green
            $restored++
        }
        catch {
            Write-Host "❌ Erro ao restaurar: $file" -ForegroundColor Red
            Write-Host "   Motivo: $($_.Exception.Message)" -ForegroundColor DarkRed
            $failed++
        }
    }
    else {
        Write-Host "⚠️  Backup não encontrado: $file" -ForegroundColor Yellow
        $failed++
    }
}

# Resumo
Write-Host ""
Write-Host "═══════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host "  📊 RESUMO DA RESTAURAÇÃO" -ForegroundColor Cyan
Write-Host "═══════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host ""
Write-Host "  ✅ Arquivos restaurados: $restored" -ForegroundColor Green
Write-Host "  ❌ Falhas: $failed" -ForegroundColor $(if ($failed -gt 0) { "Red" } else { "Gray" })
Write-Host ""

if ($restored -gt 0) {
    Write-Host "═══════════════════════════════════════════════════" -ForegroundColor Cyan
    Write-Host "  ⚠️  AÇÕES NECESSÁRIAS" -ForegroundColor Yellow
    Write-Host "═══════════════════════════════════════════════════" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "  1. Limpe o cache do navegador (Ctrl + Shift + Del)" -ForegroundColor White
    Write-Host "  2. Faça hard refresh nas páginas (Ctrl + F5)" -ForegroundColor White
    Write-Host "  3. Verifique se todas as páginas carregam corretamente" -ForegroundColor White
    Write-Host ""
}

Write-Host "✨ Processo concluído!" -ForegroundColor Cyan
Write-Host ""
Write-Host "Pressione qualquer tecla para sair..."
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
