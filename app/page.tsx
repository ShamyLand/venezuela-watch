"use client"

import { useEffect, useState } from "react"
import { useDashboardData } from "@/hooks/useDashboardData"
import { Globe, TrendingUp, AlertTriangle, Clock, Newspaper, Activity, Zap, ExternalLink, Shield } from "lucide-react"
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Label } from "recharts"

export default function Dashboard() {
  const { data, loading } = useDashboardData()
  const [activeTab, setActiveTab] = useState('flash')
  const [time, setTime] = useState(new Date())

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000)
    return () => clearInterval(timer)
  }, [])

  if (loading) return (
    <div className="min-h-screen bg-[#020617] flex flex-col items-center justify-center text-blue-400 font-mono italic">
      <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-6" />
      <span className="tracking-[0.5em] animate-pulse">LIAISON SATELLITE MSIE49...</span>
    </div>
  )
  
  const news = data?.news || []
  
  // Formatage ultra-précis pour le graphique (Dates + Prix)
  const oilData = data?.oil_prices?.map((d: any) => ({
    ...d,
    displayTime: new Date(d.timestamp).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
    displayDate: new Date(d.timestamp).toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit' }),
    fullDate: new Date(d.timestamp).toLocaleString('fr-FR', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' }),
    valeur: parseFloat(d.price)
  })).reverse() || []
  
  const analysis = data?.analyses?.[0] || { flash_json: {}, report_json: {}, alerts_json: [] }

  return (
    <main className="min-h-screen bg-[#020617] text-slate-200 font-mono relative overflow-hidden">
      {/* Background Terre Antigravity */}
      <div className="absolute inset-0 z-0 opacity-30 pointer-events-none scale-110">
        <img src="https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=2072" alt="Earth" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-b from-[#020617] via-transparent to-[#020617]" />
      </div>

      <div className="relative z-10 p-4 lg:p-8 max-w-[1700px] mx-auto">
        {/* Header de Haute Précision */}
        <header className="flex justify-between items-center mb-10 border-b border-blue-500/30 pb-6 backdrop-blur-xl bg-black/10 rounded-t-2xl px-6">
          <div className="flex items-center gap-6">
            <div className="relative">
              <Globe className="w-12 h-12 text-blue-400 animate-[spin_30s_linear_infinite] relative z-10" />
              <div className="absolute inset-0 bg-blue-500/40 blur-xl rounded-full animate-pulse" />
            </div>
            <div>
              <h1 className="text-3xl font-black tracking-tighter text-white uppercase italic">MSIE49 <span className="text-blue-500">VENEZUELA</span></h1>
              <div className="flex items-center gap-3 text-[10px] text-blue-400 font-bold tracking-[0.4em] uppercase">
                <Shield className="w-3 h-3" /> Réseau de Veille Stratégique Alpha
              </div>
            </div>
          </div>
          
          <div className="flex gap-12 items-center">
            <div className="text-right border-l border-blue-500/20 pl-8">
              <div className="text-white text-2xl font-black tracking-widest">
                {time.toLocaleTimeString()}
              </div>
              <p className="text-[10px] text-blue-400/50 uppercase font-black">{time.toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}</p>
            </div>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* COLONNE GAUCHE : FLUX NEWS (35%) */}
          <div className="lg:col-span-4 h-[78vh]">
            <div className="bg-black/60 backdrop-blur-2xl border border-blue-500/20 rounded-2xl overflow-hidden h-full flex flex-col shadow-[0_0_50px_rgba(0,0,0,0.5)]">
              <div className="bg-gradient-to-r from-blue-600/20 to-transparent p-5 border-b border-blue-500/20 flex justify-between items-center">
                <h2 className="text-xs font-black flex items-center gap-3 uppercase tracking-[0.2em] text-blue-300"><Activity className="w-4 h-4" /> Flux Renseignement</h2>
                <span className="text-[9px] bg-blue-500/20 text-blue-400 px-3 py-1 rounded-full font-bold border border-blue-500/30">CANAL_01</span>
              </div>
              <div className="flex-1 overflow-y-auto p-5 space-y-4 custom-scrollbar">
                {news.map((item: any) => (
                  <a key={item.id} href={item.url} target="_blank" rel="noopener noreferrer" className="block p-4 rounded-xl bg-white/5 border border-white/5 hover:bg-blue-600/10 hover:border-blue-500/40 transition-all group relative overflow-hidden">
                    <div className="flex justify-between text-[9px] text-blue-400/60 mb-2 font-black uppercase">
                      <span>{item.source_name}</span>
                      <span>{new Date(item.published_at).toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'})}</span>
                    </div>
                    <h3 className="text-[13px] leading-tight font-bold text-slate-100 group-hover:text-white transition-colors">{item.title_fr || item.title_original}</h3>
                    <div className="mt-2 text-[9px] text-slate-500 font-bold uppercase">{item.category}</div>
                    <Zap className="absolute bottom-2 right-2 w-3 h-3 text-blue-500/20 group-hover:text-blue-500 transition-colors" />
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* COLONNE DROITE : MARCHÉ & ANALYSE (65%) */}
          <div className="lg:col-span-8 space-y-8">
            {/* GRAPHIQUE BRENT HAUTE DÉFINITION */}
            <div className="bg-black/60 backdrop-blur-2xl border border-blue-500/20 rounded-2xl p-8 shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 p-8 opacity-10"><TrendingUp className="w-32 h-32" /></div>
              <div className="flex justify-between items-end mb-10 relative z-10">
                <div>
                  <h2 className="text-[11px] font-black uppercase tracking-[0.3em] text-blue-400 mb-2">Indice Pétrolier Brent (Global)</h2>
                  <div className="flex items-baseline gap-4">
                    <span className="text-4xl font-black text-white tracking-tighter">$81.24</span>
                    <span className="text-green-500 font-black text-sm flex items-center gap-1">▲ +1.24% <span className="text-[10px] opacity-50 font-normal">(24h)</span></span>
                  </div>
                </div>
                <div className="flex gap-2">
                  {['1H', '4H', '1D', '1W'].map(p => <button key={p} className={`px-3 py-1 text-[9px] font-bold rounded ${p === '1D' ? 'bg-blue-500 text-white' : 'bg-white/5 text-slate-500'}`}>{p}</button>)}
                </div>
              </div>
              
              <div className="h-[280px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={oilData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.5}/>
                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} opacity={0.3} />
                    <XAxis dataKey="displayTime" stroke="#475569" fontSize={10} tickLine={false} axisLine={false} dy={15} />
                    <YAxis stroke="#475569" fontSize={10} tickLine={false} axisLine={false} domain={['auto', 'auto']} tickFormatter={(v) => `$${v}`} />
                    <Tooltip 
                      contentStyle={{backgroundColor: '#0f172a', border: '1px solid #3b82f6', borderRadius: '12px', fontSize: '11px', fontWeight: 'bold'}}
                      itemStyle={{color: '#60a5fa'}}
                      labelFormatter={(t, data) => `Date: ${data[0]?.payload?.fullDate || t}`}
                    />
                    <Area type="monotone" dataKey="valeur" stroke="#3b82f6" strokeWidth={4} fill="url(#colorPrice)" animationDuration={2500} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* SYSTÈME D'ONGLETS ANALYSE IA */}
            <div className="bg-black/60 backdrop-blur-2xl border border-blue-500/20 rounded-2xl overflow-hidden min-h-[380px] flex flex-col shadow-2xl">
              <div className="flex bg-blue-900/10 border-b border-blue-500/20">
                {['flash', 'rapport', 'alertes'].map((t) => (
                  <button key={t} onClick={() => setActiveTab(t)} className={`flex-1 py-5 text-[10px] font-black uppercase tracking-[0.4em] transition-all relative ${activeTab === t ? 'text-blue-400 bg-blue-500/5' : 'text-slate-500 hover:text-slate-300'}`}>
                    {t === 'flash' ? '⚡ SYNTHÈSE FLASH' : t === 'rapport' ? '📋 RAPPORT STRATÉGIQUE' : '🚨 ALERTES CRITIQUES'}
                    {activeTab === t && <div className="absolute bottom-0 left-0 w-full h-1 bg-blue-500 shadow-[0_0_15px_#3b82f6]" />}
                  </button>
                ))}
              </div>
              <div className="p-10 flex-1">
                {activeTab === 'flash' && (
                  <div className="animate-in fade-in duration-700">
                    <div className="text-[10px] text-blue-500/50 mb-4 font-black tracking-widest uppercase">// ANALYSE_GEMINI_LIVE_PROCESSOR</div>
                    <div className="text-lg leading-relaxed text-blue-100 font-medium italic border-l-4 border-blue-500/30 pl-8 py-2">
                      "{analysis.flash_json?.content || "Synchronisation des flux de données en cours..."}"
                    </div>
                  </div>
                )}
                {activeTab === 'rapport' && (
                  <div className="animate-in slide-in-from-bottom-4 duration-500 text-sm leading-relaxed text-slate-300">
                    <div className="p-8 bg-white/5 rounded-2xl border border-white/5 shadow-inner leading-loose">
                       {analysis.report_json?.content || "Les serveurs de renseignement n'ont pas encore généré le rapport pour ce cycle de 24h."}
                    </div>
                  </div>
                )}
                {activeTab === 'alertes' && (
                  <div className="space-y-5 animate-in zoom-in-95 duration-300">
                    {analysis.alerts_json?.length > 0 ? analysis.alerts_json.map((a: any, i: number) => (
                      <div key={i} className="p-5 bg-red-500/5 border border-red-500/20 rounded-2xl flex gap-6 items-center group hover:bg-red-500/10 transition-all">
                        <div className="p-3 bg-red-500/20 rounded-xl group-hover:scale-110 transition-transform"><AlertTriangle className="w-6 h-6 text-red-500" /></div>
                        <div>
                          <div className="text-[11px] font-black text-red-500 uppercase tracking-[0.2em] mb-1">{a.title}</div>
                          <p className="text-sm text-slate-300 font-bold">{a.description}</p>
                        </div>
                      </div>
                    )) : (
                      <div className="flex flex-col items-center justify-center py-16 opacity-20 italic">
                        <Shield className="w-12 h-12 mb-4" />
                        <span className="text-xs uppercase tracking-widest">Aucune menace détectée dans le secteur</span>
                      </div>
                    )}
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
