"use client"

import { useEffect, useState } from "react"
import { useDashboardData } from "@/hooks/useDashboardData"
import { Globe, TrendingUp, AlertTriangle, Clock, Newspaper, Activity, Zap, ExternalLink } from "lucide-react"
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

export default function Dashboard() {
  const { data, loading } = useDashboardData()
  const [activeTab, setActiveTab] = useState('flash')
  const [time, setTime] = useState(new Date())

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000)
    return () => clearInterval(timer)
  }, [])

  if (loading) return (
    <div className="min-h-screen bg-[#020617] flex flex-col items-center justify-center text-blue-500 font-mono italic">
      <Globe className="w-12 h-12 mb-4 animate-spin" />
      SYNCHRONISATION SATELLITE EN COURS...
    </div>
  )
  
  const news = data?.news || []
  const oilData = data?.oil_prices?.map((d: any) => ({
    ...d,
    // Format propre pour l'axe : "Heure:Min"
    shortTime: new Date(d.timestamp).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
    // Format complet pour le pointeur
    fullDate: new Date(d.timestamp).toLocaleString('fr-FR', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' }),
    prix: parseFloat(d.price)
  })).reverse() || []
  
  const analysis = data?.analyses?.[0] || { flash_json: {}, report_json: {}, alerts_json: [] }

  return (
    <main className="min-h-screen bg-[#020617] text-slate-200 font-mono relative overflow-hidden">
      {/* Fond Terre MSIE49 */}
      <div className="absolute inset-0 z-0 opacity-20 pointer-events-none">
        <img src="https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=2072" alt="Earth" className="w-full h-full object-cover" />
      </div>

      <div className="relative z-10 p-4 lg:p-6 max-w-[1600px] mx-auto">
        <header className="flex justify-between items-center mb-8 border-b border-blue-500/30 pb-6 backdrop-blur-md">
          <div className="flex items-center gap-4">
            <Globe className="w-10 h-10 text-blue-400 animate-[spin_20s_linear_infinite]" />
            <div>
              <h1 className="text-2xl font-black tracking-tighter text-white uppercase italic">MSIE49 <span className="text-blue-500 font-bold">VENEZUELA</span></h1>
              <div className="flex items-center gap-2 text-[9px] text-blue-400 font-bold uppercase tracking-widest">
                <span className="w-2 h-2 bg-green-500 rounded-full animate-ping" /> Terminal de Veille Stratégique
              </div>
            </div>
          </div>
          <div className="text-right border-l border-blue-500/20 pl-6">
            <div className="text-white text-xl font-black flex items-center gap-2">
              <Clock className="w-5 h-5 text-blue-500" /> {time.toLocaleTimeString()}
            </div>
            <p className="text-[10px] text-blue-400/50 uppercase font-bold">{time.toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' })}</p>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* FLUX NEWS GAUCHE */}
          <div className="lg:col-span-4 h-[75vh]">
            <div className="bg-black/60 backdrop-blur-xl border border-blue-500/20 rounded-xl overflow-hidden h-full flex flex-col shadow-2xl">
              <div className="bg-blue-500/10 p-4 border-b border-blue-500/20 flex justify-between items-center">
                <h2 className="text-xs font-black flex items-center gap-2 uppercase tracking-widest text-blue-400"><Newspaper className="w-4 h-4" /> Renseignement Direct</h2>
                <span className="text-[9px] bg-green-500/20 text-green-400 px-2 py-0.5 rounded animate-pulse">LIVE</span>
              </div>
              <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar">
                {news.map((item: any) => (
                  <a key={item.id} href={item.url} target="_blank" rel="noopener noreferrer" className="block p-4 rounded-lg bg-white/5 border border-white/5 hover:border-blue-500/40 hover:bg-blue-500/5 transition-all group relative">
                    <div className="flex justify-between text-[8px] text-blue-400/60 mb-2 font-bold uppercase">
                      <span>{item.source_name}</span>
                      <span>{new Date(item.published_at).toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'})}</span>
                    </div>
                    <h3 className="text-[11px] leading-snug font-semibold group-hover:text-blue-300 transition-colors">{item.title_fr || item.title_original}</h3>
                    <ExternalLink className="absolute top-2 right-2 w-3 h-3 opacity-0 group-hover:opacity-40" />
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* CENTRE DROITE : GRAPHIQUE ET ANALYSE IA */}
          <div className="lg:col-span-8 space-y-6">
            {/* GRAPHIQUE AVEC AXES VISIBLES */}
            <div className="bg-black/60 backdrop-blur-xl border border-blue-500/20 rounded-xl p-6">
              <div className="flex justify-between items-center mb-6">
                <div className="text-[10px] font-black uppercase tracking-widest text-blue-400 flex items-center gap-2"><TrendingUp className="w-4 h-4" /> Marché du Pétrole Brut (BRENT)</div>
                <div className="text-lg font-black text-white">$81.24 <span className="text-green-500 text-xs ml-1 font-bold">▲ 1.2%</span></div>
              </div>
              <div className="h-[250px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={oilData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.4}/>
                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} opacity={0.3} />
                    <XAxis data
