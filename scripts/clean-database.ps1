# Script pour nettoyer les vieilles news et forcer une nouvelle analyse

$SUPABASE_URL = "https://sslmvodnafyqvqibubag.supabase.co"
$SERVICE_KEY = "sb_secret_PsprUKNyRbZHQ9NwSW4Dzg_02Lo-qc2"

Write-Host "Nettoyage de la base de donnees..." -ForegroundColor Cyan

# 1. Supprimer toutes les vieilles news (avant 2025)
Write-Host "Suppression des news avant 2025..." -ForegroundColor Yellow

$deleteNewsHeaders = @{
    "apikey"        = $SERVICE_KEY
    "Authorization" = "Bearer $SERVICE_KEY"
    "Content-Type"  = "application/json"
    "Prefer"        = "return=representation"
}

try {
    $deleteResponse = Invoke-RestMethod -Uri "$SUPABASE_URL/rest/v1/news?published_at=lt.2025-01-01T00:00:00" -Method Delete -Headers $deleteNewsHeaders
    
    Write-Host "Vieilles news supprimees!" -ForegroundColor Green
}
catch {
    Write-Host "Erreur lors de la suppression" -ForegroundColor Red
}

# 2. Attendre 2 secondes
Start-Sleep -Seconds 2

# 3. Forcer une nouvelle analyse
Write-Host "Declenchement d'une nouvelle analyse..." -ForegroundColor Yellow

try {
    $analyzeResponse = Invoke-RestMethod -Uri "https://venezuela-watch.vercel.app/api/cron/analyze" -Method Get

    Write-Host "Analyse terminee!" -ForegroundColor Green
    Write-Host "Articles traites:" $analyzeResponse.data.articles_processed -ForegroundColor White
    Write-Host "Timestamp:" $analyzeResponse.data.analysis_timestamp -ForegroundColor White
}
catch {
    Write-Host "Erreur lors de l'analyse" -ForegroundColor Red
}

Write-Host "Termine! Rafraichissez votre dashboard maintenant." -ForegroundColor Green
