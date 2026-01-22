"use client"

import { useEffect, useState } from "react"
import { useDashboardData } from "@/hooks/useDashboardData"
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  PieChart, Pie, Cell 
} from "recharts"

export default function Dashboard() {
  const { data, loading } = useDashboardData()
  const [activeTab, setActiveTab] = useState('flash')
  const [times, setTimes] = useState({ paris: "--:--:--", caracas: "--:--:--" })

  // Gestion des horloges Caracas / Paris
  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date()
      setTimes({
        paris: new Intl.DateTimeFormat('fr-FR', { hour: '2-digit', minute: '2-digit', second: '2-digit', timeZone: 'Europe/Paris' }).format(now),
        caracas: new Intl.DateTimeFormat('fr-FR', { hour: '2-digit', minute: '2-digit', second: '2-digit', timeZone: 'America/Caracas' }).format(now)
      })
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  if (loading) return <div className="min-h-screen bg-[#0a0e17] flex items-center justify-center text-[#00d4ff] font-mono animate-pulse">LIAISON SATELLITE...</div>
  
  const news = data?.news || []
  const oilData = data?.oil_prices?.map((d: any) => ({
    time: new Date(d.timestamp).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
    price: parseFloat(d.price)
  })).reverse() || []
  
  const analysis = data?.analyses?.[0] || { flash_json: {}, report_json: {}, alerts_json: [] }

  // Données pour le graphique Doughnut PDVSA
  const pdvsaData = [
    { name: 'Chine', value: 65 },
    { name: 'Inde', value: 20 },
    { name: 'Autres', value: 15 },
  ]
  const COLORS = ['#00d4ff', '#00ff88', '#ff6b35']

  return (
    <div className="min-h-screen bg-[#0a0e17] text-[#e8e8e8] font-sans selection:bg-[#00d4ff] selection:text-[#0a0e17] relative">
      {/* Styles Globaux injectés (CSS d'origine) */}
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;900&family=JetBrains+Mono:wght@400;700&display=swap');
        body {
          background-image: linear-gradient(rgba(10, 14, 23, 0.4), rgba(10, 14, 23, 0.4)), url('https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=2000');
          background-size: cover; background-attachment: fixed;
        }
        .glass-card {
          background: rgba(13, 21, 38, 0.6); border: 1px solid rgba(255, 255, 255, 0.08);
          border-top: 1px solid rgba(255, 255, 255, 0.15); backdrop-filter: blur(20px);
        }
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(0, 212, 255, 0.4); border-radius: 2px; }
      `}</style>

      {/* HEADER */}
      <header className="h-16 border-b border-[#00d4ff1a] bg-[#0d1526d9] backdrop-blur-md flex items-center justify-between px-6 sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-[#00d4ff1a] border border-[#00d4ff4d] rounded-lg flex items-center justify-center text-2xl shadow-[0_0_15px_rgba(0,212,255,0.2)]">🌍</div>
          <div>
            <h1 className="text-xl font-black tracking-tighter bg-gradient-to-r from-white to-[#00d4ff] bg-clip-text text-fill-transparent uppercase font-mono italic">MSIE49 VENEZUELA VEILLE</h1>
            <div className="flex items-center gap-2 text-[10px] text-[#8892a0] tracking-widest font-mono">
              <span className="w-1.5 h-1.5 bg-[#00ff88] rounded-full animate-pulse shadow-[0_0_8px_#00ff88]" /> TERMINAL EN DIRECT | UNITÉ RENSEIGNEMENT
            </div>
          </div>
        </div>
        <div className="flex items-center gap-6 border-l border-white/10 pl-6 font-mono">
          <div className="text-right">
            <span className="block text-[10px] text-[#8892a0]">CARACAS (VNZ)</span>
            <span className="text-sm font-bold text-[#00d4ff]">{times.caracas}</span>
          </div>
          <div className="text-right">
            <span className="block text-[10px] text-[#8892a0]">PARIS (FRANCE)</span>
            <span className="text-sm font-bold text-[#00d4ff]">{times.paris}</span>
          </div>
        </div>
      </header>

      {/* MAIN CONTENT */}
      <main className="p-6 grid grid-cols-12 gap-6 max-w-[1600px] mx-auto">
        
        {/* NEWS FEED (G) */}
        <section className="col-span-12 lg:col-span-4 glass-card rounded-xl overflow-hidden flex flex-col h-[600px]">
          <div className="p-4 bg-black/20 border-b border-white/5 flex justify-between items-center">
            <h2 className="text-xs font-bold tracking-widest font-mono uppercase">📰 Flux News Direct</h2>
            <span className="text-[10px] text-[#00ff88] font-mono animate-pulse">LIVE</span>
          </div>
          <div className="flex-1 overflow-y-auto p-2 space-y-2 custom-scrollbar">
            {news.map((item: any) => (
              <a key={item.id} href={item.url} target="_blank" className="block p-3 bg-[#0a0e1766] border-l-2 border-white/10 hover:border-[#00d4ff] hover:translate-x-1 transition-all rounded">
                <div className="flex justify-between text-[10px] mb-1 font-mono">
                  <span className="text-[#8892a0]">{item.source_name} • {new Date(item.published_at).toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'})}</span>
                  <span className="px-1.5 py-0.5 bg-white/5 border border-white/10 rounded uppercase">{item.category}</span>
                </div>
                <h3 className="text-sm font-medium leading-snug">{item.title_fr || item.title_original}</h3>
              </a>
            ))}
          </div>
        </section>

        {/* AI PANEL (C) */}
        <section className="col-span-12 lg:col-span-5 glass-card rounded-xl overflow-hidden flex flex-col min-h-[600px]">
          <div className="grid grid-cols-3 border-b border-white/10">
            {['flash', 'report', 'alerts'].map((tab) => (
              <button key={tab} onClick={() => setActiveTab(tab)} className={`p-4 text-[10px] font-bold uppercase tracking-widest transition-all border-b-2 ${activeTab === tab ? 'bg-[#00d4ff0d] text-[#00d4ff] border-[#00d4ff] shadow-[0_0_8px_rgba(0,212,255,0.4)]' : 'text-[#8892a0] border-transparent hover:text-white'}`}>
                {tab === 'flash' ? '💻 Flash' : tab === 'report' ? '📊 Rapport' : '⏰ Alertes'}
              </button>
            ))}
          </div>
          <div className="p-6 flex-1">
            {activeTab === 'flash' && (
              <div className="animate-in fade-in duration-500">
                <span className="inline-flex items-center gap-2 px-3 py-1.5 bg-[#00d4ff1a] text-[#00d4ff] border border-[#00d4ff4d] rounded-full text-[10px] font-bold uppercase mb-6 shadow-sm">📈 Tendance : MODÉRÉE POSITIVE</span>
                <div className="space-y-4
