-- Script SQL à exécuter dans Supabase pour corriger le RLS
-- Copiez-collez dans SQL Editor de Supabase

-- Désactiver RLS sur oil_prices pour permettre les insertions API
ALTER TABLE oil_prices DISABLE ROW LEVEL SECURITY;

-- Vérification (optionnel)
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE tablename = 'oil_prices';
