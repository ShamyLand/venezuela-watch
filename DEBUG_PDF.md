# Guide de Débogage - Export PDF

## 🔍 Pour identifier l'erreur exacte

### Étape 1 : Ouvrir la Console du Navigateur

1. Sur votre site Venezuela Watch, appuyez sur **F12** (ou clic droit > Inspecter)
2. Cliquez sur l'onglet **"Console"** en haut
3. Laissez cet onglet ouvert

### Étape 2 : Reproduire l'erreur

1. Cliquez sur le bouton **"EXPORTER PDF"**
2. Attendez que l'erreur apparaisse
3. Dans la console, vous verrez des messages en **rouge** avec les détails de l'erreur

### Étape 3 : M'envoyer les erreurs

Faites une **capture d'écran** de la console avec les messages d'erreur en rouge.

---

## 🔧 Causes Possibles

### Cause 1 : Pas de données dans Supabase
**Symptôme** : `newsData is empty` ou `No data found`
**Solution** : Vérifier que des actualités existent dans la table `news`

### Cause 2 : Gemini API timeout
**Symptôme** : `timeout` ou `504 Gateway Timeout`
**Solution** : Réduire la quantité de données à analyser

### Cause 3 : Erreur de parsing JSON
**Symptôme** : `JSON.parse error` ou `Unexpected token`
**Solution** : Gemini n'a pas retourné un JSON valide

### Cause 4 : Import jsPDF échoue
**Symptôme** : `Cannot find module jspdf`
**Solution** : Les dépendances ne sont pas installées sur Vercel

---

## 🚨 Action Immédiate

**Ouvrez la console (F12) et refaites le test. Les erreurs affichées nous diront exactement quoi corriger !**
