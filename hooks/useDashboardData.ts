import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

export function useDashboardData() {
  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<any>(null)

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true)
        
        // On lance les 3 requêtes en même temps
        const [newsRes, oilRes, analysisRes] = await Promise.all([
          supabase.from('news').select('*').order('published_at', { ascending: false }).limit(10),
          supabase.from('oil_prices').select('*').order('timestamp', { ascending: false }).limit(20),
          supabase.from('analyses').select('*').order('created_at', { ascending: false }).limit(1)
        ])

        // On vérifie s'il y a des erreurs
        if (newsRes.error) throw newsRes.error
        
        // On range les données dans le bon format pour page.tsx
        setData({
          news: newsRes.data || [],
          oil_prices: oilRes.data || [],
          analyses: analysisRes.data || []
        })
      } catch (err) {
        console.error('Erreur hook:', err)
        setError(err)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  return { data, loading, error }
}
