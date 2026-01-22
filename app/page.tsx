"use client"

import { useEffect, useState } from "react"
import { useDashboardData } from "@/hooks/useDashboardData"
import { Globe, TrendingUp, AlertTriangle, Clock, Newspaper, Cpu, History, ExternalLink, Activity } from "lucide-react"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from "recharts"

export default function Dashboard() {
  const { data, loading, error } = useDashboardData()
  const [activeTab, setActiveTab] = useState('flash')
  const [time, setTime] = useState(new Date())

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000)
    return () => clearInterval(timer)
  }, [])

  if (loading) return <div className="min-h-screen bg-black flex items-center justify-center text-blue-500 font-mono animate-pulse">RECEPTION SIGNAL SATELLITE...</div>
  
  // Sécurisation des données pour éviter l'Application Error
  const news = data?.news || []
  const oilData = data?.oil_prices || []
  const analysis = data?.analyses?.[0] || { flash_json: {}, report_json: {}, alerts_json: [] }
  const alerts = analysis.alerts_json || []

  return (
    <main className="min-h-screen bg-[#020617] text-slate-200 font-mono relative overflow-hidden">
      {/* Fond d'écran Terre (Style MSIE49) */}
      <div className="absolute inset-0 z-0 opacity-40 pointer-events-none">
        <img src="https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=2072" alt="Earth" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#020617] via-transparent to-[#020617]/80" />
      </div>

      <div className="relative z-10 p-4 lg:p-6 max-w-[1600px] mx-auto">
        {/* Header avec Horloge */}
        <header className="flex justify-between items-center mb-8 border-b border-blue-500/20 pb-4 backdrop-blur-sm">
          <div className="flex items-center gap-4">
            <div className="p-2 bg-blue-500/10 rounded-lg border border-blue-500/30">
              <Globe className="w-8 h-8 text-blue-400 animate-[spin_10s_linear_infinite]" />
            </div>
            <div>
              <h1 className="text-2xl font-black tracking-tighter text-white">MSIE49 VENEZUELA VEILLE</h1>
              <div className="flex items-center gap-2 text-[10px] text-blue-400 uppercase tracking-widest">
                <span className="w-2 h-2 bg-green-500 rounded-full animate-ping" />
                Terminal en direct | Unité Renseignement Stratégique
              </div>
            </div>
          </div>
          
          <div className="flex gap-8 text-right">
             <div>
              <p className="text-[10px] text-blue-400/50 uppercase">Indicateur de tension</p>
              <div className="w-32 h-1.5 bg-blue-900/30 rounded-full mt-1 overflow-hidden">
                <div className="w-[65%] h-full bg-gradient-to-r from-blue-500 to-orange-500" />
              </div>
            </div>
            <div className="border-l border-blue-500/20 pl-8">
              <div className="text-blue-100 text-xl font-bold flex items-center gap-3">
                <Clock className="w-5 h-5 text-blue-400" /> {time.toLocaleTimeString()}
              </div>
              <p className="text-[10px] text-blue-400/50 uppercase tracking-tighter">Paris (France) • {time.toLocaleDateString()}</p>
            </div>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* COLONNE GAUCHE : NEWS */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-black/40 backdrop-blur-md border border-blue-500/20 rounded-xl overflow-hidden">
              <div className="bg-blue-500/10 p-3 border-b border-blue-500/20 flex justify-between items-center">
                <h2 className="text-xs font-bold flex items-center gap-2 uppercase tracking-widest"><Newspaper className="w-4 h-4 text-blue-400" /> Flux News Direct</h2>
                <span className="text-[9px] px-2 py-0.5 bg-green-500/20 text-green-400 rounded">LIVE</span>
              </div>
              <div className="p-4 space-y-4 max-h-[70vh] overflow-y-auto custom-scrollbar">
                {news.length === 0 ? (
                  <div className="text-center py-10 opacity-30 text-xs italic">Initialisation du flux de données...</div>
                ) : news.map((item: any) => (
                  <a key={item.id} href={item.url} target="_blank" rel="noopener noreferrer" className="block p-4 rounded-lg border border-white/5 bg-white/5 hover:bg-blue-500/10 transition-all group">
                    <div className="flex justify-between text-[10px] text-blue-400/60 mb-2">
                      <span className="font-bold">{item.source_name || 'REUTERS'} • {new Date(item.published_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                      <span className="px-2 py-0.5 bg-blue-500/20 rounded text-[9px] uppercase tracking-tighter">{item.category || 'Politique'}</span>
                    </div>
                    <h3 className="text-sm font-semibold group-hover:text-blue-300 transition-colors leading-snug">{item.title_fr || item.title_original}</h3>
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* COLONNE DROITE : MARCHÉ & ANALYSE */}
          <div className="lg:col-span-8 space-y-6">
            {/* Graphique Pétrole */}
            <div className="bg-black/40 backdrop-blur-md border border-blue-500/20 rounded-xl p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xs font-bold flex items-center gap-2 uppercase tracking-widest"><TrendingUp className="w-4 h-4 text-blue-400" /> Marché Pétrolier</h2>
                <div className="flex gap-4">
                  <div className="text-xs"><span className="text-slate-500 mr-2">BRENT</span> <span className="text-white font-bold">$81.24</span> <span className="text-green-400 text-[10px] ml-1">▲ 1.2%</span></div>
                  <div className="text-xs"><span className="text-slate-500 mr-2">WTI</span> <span className="text-white font-bold">$77.30</span> <span className="text-green-400 text-[10px] ml-1">▲ 0.8%</span></div>
                </div>
              </div>
              <div className="h-[250px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={oilData.length > 0 ? oilData : [{price: 80}, {price: 81}, {price: 80.5}, {price: 82}]}>
                    <defs>
                      <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                    <XAxis dataKey="timestamp" hide />
                    <YAxis hide domain={['auto', 'auto']} />
                    <Tooltip contentStyle={{backgroundColor: '#0f172a', border: '1px solid #1e3a8a', borderRadius: '8px', fontSize: '10px'}} />
                    <Area type="monotone" dataKey="price" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorPrice)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Système d'Onglets Analyse */}
            <div className="bg-black/40 backdrop-blur-md border border-blue-500/20 rounded-xl overflow-hidden">
              <div className="flex bg-blue-950/20">
                {['flash', 'rapport', 'alertes'].map((tab) => (
                  <button key={tab} onClick={() => setActiveTab(tab)} className={`flex-1 py-4 text-[10px] font-bold uppercase tracking-[0.2em] transition-all border-b-2 ${activeTab === tab ? 'bg-blue-500/10 text-blue-300 border-blue-500' : 'text-slate-500 border-transparent hover:text-slate-300'}`}>
                    {tab === 'flash' ? '⚡ Flash Synthèse' : tab === 'rapport' ? '📋 Rapport Détail' : '🚨 Alertes'}
                  </button>
                ))}
              </div>
              <div className="p-8 min-h-[350px]">
                {activeTab === 'alertes' && (
                  <div className="space-y-4">
                    {alerts.length === 0 ? (
                      <div className="flex flex-col items-center justify-center h-48 opacity-20"><AlertTriangle className="w-12 h-12 mb-4" /><p>Aucune alerte critique en cours</p></div>
                    ) : alerts.map((alert: any, idx: number) => (
                      <div key={idx} className="p-5 border-l-4 border-red-500 bg-red-500/5 rounded-r-xl">
                        <h4 className="text-red-400 font-black text-sm uppercase mb-2">{alert.title || 'Alerte Inconnue'}</h4>
                        <p className="text-xs text-slate-400 leading-relaxed">{alert.description || alert.content}</p>
                        <p className="text-[9px] text-red-500/50 mt-2 font-bold uppercase">Source: {alert.source || 'Renseignement Stratégique'}</p>
                      </div>
                    ))}
                  </div>
                )}
                {activeTab === 'flash' && (
                  <div className="space-y-6">
                    <div className="p-4 bg-blue-500/5 rounded-lg border border-blue-500/10 italic text-blue-200 text-sm leading-relaxed">
                       {analysis.flash_json?.content || "En attente de la prochaine génération d'analyse par l'IA..."}
                    </div>
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
