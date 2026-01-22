"use client"

import { useEffect, useState } from "react"
import { useDashboardData } from "@/hooks/useDashboardData"
import { Globe, TrendingUp, AlertTriangle, Clock, Newspaper, ChevronRight } from "lucide-react"
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts"

export default function Dashboard() {
  const { data, loading } = useDashboardData()
  const [activeTab, setActiveTab] = useState('flash')
  const [time, setTime] = useState(new Date())

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000)
    return () => clearInterval(timer)
  }, [])

  if (loading) return <div className="min-h-screen bg-[#020617] flex items-center justify-center text-blue-500 font-mono animate-pulse">RECEPTION SIGNAL SATELLITE...</div>
  
  const news = data?.news || []
  const oilData = data?.oil_prices?.map((d: any) => ({
    ...d,
    time: new Date(d.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    prix: parseFloat(d.price)
  })).reverse() || []
  
  const analysis = data?.analyses?.[0] || { flash_json: {}, report_json: {}, alerts_json: [] }

  return (
    <main className="min-h-screen bg-[#020617] text-slate-200 font-mono relative overflow-hidden">
      {/* Fond Terre */}
      <div className="absolute inset-0 z-0 opacity-30 pointer-events-none">
        <img src="https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=2072" alt="Earth" className="w-full h-full object-cover" />
      </div>

      <div className="relative z-10 p-4 max-w-[1600px] mx-auto">
        <header className="flex justify-between items-center mb-8 border-b border-blue-500/20 pb-4">
          <div className="flex items-center gap-4">
            <Globe className="w-8 h-8 text-blue-400 animate-spin-slow" />
            <div>
              <h1 className="text-xl font-black tracking-tighter text-white uppercase">MSIE49 VENEZUELA VEILLE</h1>
              <div className="flex items-center gap-2 text-[9px] text-blue-400 uppercase">
                <span className="w-2 h-2 bg-green-500 rounded-full animate-ping" /> Terminal de Renseignement Actif
              </div>
            </div>
          </div>
          <div className="text-right border-l border-blue-500/20 pl-6">
            <div className="text-blue-100 text-lg font-bold">{time.toLocaleTimeString()}</div>
            <div className="text-[9px] text-blue-400/50 uppercase">{time.toLocaleDateString()}</div>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* FLUX NEWS */}
          <div className="lg:col-span-4">
            <div className="bg-black/60 backdrop-blur-md border border-blue-500/20 rounded-xl overflow-hidden h-[80vh] flex flex-col">
              <div className="bg-blue-500/10 p-3 border-b border-blue-500/20 flex justify-between items-center">
                <span className="text-[10px] font-bold uppercase flex items-center gap-2"><Newspaper className="w-3 h-3" /> Flux Satellite Direct</span>
              </div>
              <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar">
                {news.map((item: any) => (
                  <a key={item.id} href={item.url} target="_blank" rel="noopener noreferrer" className="block p-3 rounded bg-white/5 border border-white/5 hover:border-blue-500/30 transition-all group">
                    <div className="flex justify-between text-[8px] text-blue-400/60 mb-1 uppercase font-bold">
                      <span>{item.source_name}</span>
                      <span>{new Date(item.published_at).toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'})}</span>
                    </div>
                    <h3 className="text-[11px] leading-tight font-medium group-hover:text-blue-300 transition-colors">{item.title_fr || item.title_original}</h3>
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* CENTRE : GRAPHIQUE & ANALYSE */}
          <div className="lg:col-span-8 space-y-6">
            {/* MARCHE PETROLIER */}
            <div className="bg-black/60 backdrop-blur-md border border-blue-500/20 rounded-xl p-6">
              <div className="flex justify-between items-center mb-4 text-[10px] font-bold uppercase tracking-widest text-blue-400">
                <div className="flex items-center gap-2"><TrendingUp className="w-4 h-4" /> Analyse du Marché Pétrolier</div>
                <div className="flex gap-4">
                  <span className="text-white">BRENT: $81.24 <span className="text-green-500">▲</span></span>
                </div>
              </div>
              <div className="h-[250px] w-full mt-4">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={oilData}>
                    <defs>
                      <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                    <XAxis dataKey="time" stroke="#475569" fontSize={10} tickLine={false} axisLine={false} />
                    <YAxis stroke="#475569" fontSize={10} tickLine={false} axisLine={false} domain={['auto', 'auto']} />
                    <Tooltip contentStyle={{backgroundColor: '#0f172a', border: '1px solid #1e3a8a', fontSize: '10px'}} />
                    <Area type="monotone" dataKey="prix" stroke="#3b82f6" strokeWidth={2} fill="url(#colorPrice)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* ONGLET ANALYSE */}
            <div className="bg-black/60 backdrop-blur-md border border-blue-500/20 rounded-xl overflow-hidden min-h-[300px]">
              <div className="flex bg-blue-500/5">
                {['flash', 'rapport', 'alertes'].map((t) => (
                  <button key={t} onClick={() => setActiveTab(t)} className={`flex-1 py-3 text-[9px] font-bold uppercase tracking-widest border-b-2 transition-all ${activeTab === t ? 'text-blue-400 border-blue-500 bg-blue-500/10' : 'text-slate-500 border-transparent hover:text-slate-300'}`}>
                    {t}
                  </button>
                ))}
              </div>
              <div className="p-6">
                {activeTab === 'flash' && (
                  <div className="text-sm leading-relaxed text-blue-100 italic border-l-2 border-blue-500/30 pl-4">
                    {analysis.flash_json?.content || "Analyse en cours de génération..."}
                  </div>
                )}
                {activeTab === 'rapport' && (
                  <div className="text-xs leading-relaxed text-slate-300 space-y-4">
                    <div className="p-4 bg-white/5 rounded border border-white/5">
                      {analysis.report_json?.content || "Aucun rapport détaillé disponible pour cette période."}
                    </div>
                  </div>
                )}
                {activeTab === 'alertes' && (
                  <div className="space-y-3">
                    {analysis.alerts_json?.map((a: any, i: number) => (
                      <div key={i} className="p-3 bg-red-500/5 border-l-4 border-red-500 flex items-start gap-3">
                        <AlertTriangle className="w-4 h-4 text-red-500 mt-0.5" />
                        <div>
                          <div className="text-[10px] font-bold text-red-400 uppercase">{a.title}</div>
                          <div className="text-[11px] text-slate-400">{a.description}</div>
                        </div>
                      </div>
                    )) || <div className="text-[10px] text-center opacity-30 italic">Aucune alerte active</div>}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
