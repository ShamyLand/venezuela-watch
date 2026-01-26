# 🕐 Configuration CRON pour Mise à Jour Automatique des News

Ce guide explique comment configurer une tâche CRON automatique **gratuite** pour mettre à jour régulièrement le flux de nouvelles de votre dashboard Venezuela Watch.

## 🎯 Objectif

Déclencher automatiquement l'endpoint `/api/cron/analyze` toutes les heures pour :
- ✅ Récupérer de nouveaux articles des flux RSS (Reuters, BBC, AP, etc.)
- ✅ Mettre à jour les prix du pétrole (Brent, WTI)
- ✅ Générer une analyse IA avec Gemini
- ✅ Stocker les données dans Supabase

## 📋 Option 1 : cron-job.org (Recommandé - Gratuit)

### Étape 1 : Créer un compte

1. Visitez [cron-job.org](https://cron-job.org)
2. Cliquez sur **"Sign up for free"**
3. Créez un compte gratuit (email + mot de passe)
4. Vérifiez votre email

### Étape 2 : Créer un CRON job

1. Une fois connecté, cliquez sur **"Create cronjob"**
2. Remplissez les champs :

   **Title** : `Venezuela Watch - News Update`
   
   **URL** : `https://[VOTRE-APP].vercel.app/api/cron/analyze`
   *(Remplacez `[VOTRE-APP]` par votre nom de domaine Vercel)*
   
   **Schedule** :
   - Utilisez le **mode simple** : Every **1 hour**
   - Ou **mode avancé** : `0 * * * *` (toutes les heures à la minute 0)
   
   **Enabled** : ✅ Activé

3. Cliquez sur **"Create cronjob"**

### Étape 3 : Tester

1. Dans la liste des cronjobs, cliquez sur votre job `Venezuela Watch - News Update`
2. Cliquez sur **"Run now"** pour exécuter manuellement
3. Vérifiez les logs :
   - **Status** doit être `200 OK`
   - **Response** doit contenir `"success": true`

### Étape 4 : Vérifier les résultats

1. Ouvrez votre [dashboard Supabase](https://supabase.com/dashboard)
2. Allez dans **Table Editor** → `news`
3. Vérifiez que de nouveaux articles sont présents avec des dates récentes
4. Ouvrez votre dashboard Venezuela Watch
5. Le cadre **"📰 Flux News Direct"** doit afficher les nouveaux articles

## 📋 Option 2 : EasyCron (Alternative gratuite)

1. Visitez [easycron.com](https://www.easycron.com/user/register)
2. Créez un compte gratuit
3. Cliquez sur **"Add Cron Job"**
4. Configurez :
   - **URL** : `https://[VOTRE-APP].vercel.app/api/cron/analyze`
   - **Cron Expression** : `0 * * * *`
   - **HTTP Method** : GET
5. Cliquez sur **"Create"**

## 📋 Option 3 : Vercel CRON (Payant - Plan Pro requis)

Si vous avez un plan Vercel Pro (20$/mois), vous pouvez utiliser le CRON natif :

1. Créez un fichier `vercel.json` à la racine du projet
2. Ajoutez la configuration suivante :

```json
{
  "crons": [
    {
      "path": "/api/cron/analyze",
      "schedule": "0 * * * *"
    }
  ]
}
```

3. Déployez sur Vercel : `vercel --prod`
4. Les CRON jobs apparaîtront dans **Vercel Dashboard** → Votre projet → **Cron Jobs**

## 🧪 Test Manuel

Pour tester immédiatement sans attendre le CRON :

### Dans le navigateur
Visitez directement : `https://[VOTRE-APP].vercel.app/api/cron/analyze`

Vous devriez voir :
```json
{
  "success": true,
  "message": "RSS + Oil + Gemini analysis completed",
  "data": {
    "articles_processed": 15,
    "oil_prices": {
      "brent": 81.24,
      "wti": 77.30
    }
  }
}
```

### Avec PowerShell
```powershell
curl https://[VOTRE-APP].vercel.app/api/cron/analyze
```

### Avec curl (Git Bash)
```bash
curl -X GET https://[VOTRE-APP].vercel.app/api/cron/analyze
```

## 📊 Vérification des Logs

### Logs Vercel
1. Allez sur [vercel.com/dashboard](https://vercel.com/dashboard)
2. Sélectionnez votre projet
3. Cliquez sur **"Logs"**
4. Filtrez par `/api/cron/analyze`
5. Vérifiez les messages :
   - ✅ `Fetching from RSS feeds...`
   - ✅ `Retrieved X articles from RSS`
   - ✅ `Gemini analysis generated successfully!`

### Logs Supabase
1. Allez sur [supabase.com/dashboard](https://supabase.com/dashboard)
2. Sélectionnez votre projet
3. **Table Editor** → `news` : Vérifiez les nouveaux articles
4. **Table Editor** → `analyses` : Vérifiez les nouvelles analyses
5. **Table Editor** → `oil_prices` : Vérifiez les nouveaux prix

## ⚡ Fréquence Recommandée

| Fréquence | CRON Expression | Description |
|-----------|----------------|-------------|
| **Toutes les heures** | `0 * * * *` | ⭐ **Recommandé** - Bon équilibre |
| Toutes les 2 heures | `0 */2 * * *` | Plus économe en ressources |
| Toutes les 30 min | `*/30 * * * *` | Très réactif (peut consommer plus d'API calls) |
| Toutes les 6 heures | `0 */6 * * *` | Mise à jour légère |

## ❓ Résolution de problèmes

### Le CRON retourne une erreur 500
- Vérifiez les variables d'environnement Vercel (`GEMINI_API_KEY`, `SUPABASE_URL`, etc.)
- Consultez les logs Vercel pour voir l'erreur exacte

### Pas de nouveaux articles dans le dashboard
1. Vérifiez que le CRON s'exécute bien (logs cron-job.org)
2. Vérifiez la table `news` dans Supabase
3. Rafraîchissez le dashboard (bouton "RAFRAÎCHIR ↻" en bas)

### Les flux RSS ne retournent rien
- Les flux RSS filtrent uniquement les articles contenant les mots-clés Venezuela
- Si aucun article récent sur le Venezuela, le système utilise des données mock

## 🎉 C'est fait !

Votre dashboard Venezuela Watch devrait maintenant se mettre à jour automatiquement toutes les heures avec de nouveaux articles RSS ! 🚀
