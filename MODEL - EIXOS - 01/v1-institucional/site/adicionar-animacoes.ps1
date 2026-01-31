# Script para adicionar animações globais em todas as páginas
$pages = @(
    "projetos.html",
    "galeria.html",
    "editais.html",
    "noticias.html",
    "doe-aqui.html",
    "fale-conosco.html"
)

Write-Host "🎨 Adicionando animações globais nas páginas..." -ForegroundColor Cyan
Write-Host ""

foreach ($page in $pages) {
    Write-Host "📄 Processando $page..." -ForegroundColor Yellow
    
    $content = Get-Content $page -Raw -Encoding UTF8
    
    # Adicionar CSS (após style.css e antes do próximo link)
    if ($content -notmatch 'global-animations\.css') {
        $content = $content -replace '(<link rel="stylesheet" href="assets/css/style\.css" />)', "`$1`r`n    <link rel=\"stylesheet\" href=\"assets/css/global-animations.css\" />"
        Write-Host "  ✅ CSS global-animations.css adicionado" -ForegroundColor Green
    }
    else {
        Write-Host "  ⚠️  CSS global-animations.css já existe" -ForegroundColor DarkYellow
    }
    
    # Adicionar JS (antes do último script)
    if ($content -notmatch 'global-animations\.js') {
        $content = $content -replace '(</body>)', "    <script src=\"assets/js/global-animations.js\"></script>`r`n  `$1"
        Write-Host "  ✅ JS global-animations.js adicionado" -ForegroundColor Green
    }
    else {
        Write-Host "  ⚠️  JS global-animations.js já existe" -ForegroundColor DarkYellow
    }
    
    # Salvar arquivo
    $content | Set-Content $page -Encoding UTF8 -NoNewline
    Write-Host "  ✅ $page atualizado!" -ForegroundColor Green
    Write-Host ""
}

Write-Host "═══════════════════════════════════════" -ForegroundColor Cyan
Write-Host "  ✨ CONCLUÍDO!" -ForegroundColor Cyan
Write-Host "═══════════════════════════════════════" -ForegroundColor Cyan
Write-Host ""
Write-Host "Todas as páginas agora possuem:" -ForegroundColor White
Write-Host "  • global-animations.css" -ForegroundColor Green
Write-Host "  • global-animations.js" -ForegroundColor Green
Write-Host ""
Write-Host "Recursos disponíveis:" -ForegroundColor White
Write-Host "  • Animações automáticas em elementos" -ForegroundColor Cyan
Write-Host "  • Ícones com cores dos pilares" -ForegroundColor Cyan
Write-Host "  • Efeitos hover premium" -ForegroundColor Cyan
Write-Host "  • Scroll progress bar" -ForegroundColor Cyan
Write-Host "  • Parallax sutil" -ForegroundColor Cyan
Write-Host ""
