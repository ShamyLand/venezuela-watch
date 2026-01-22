"use client"

import { useEffect, useState } from "react"
import { useDashboardData } from "@/hooks/useDashboardData"
import { Globe, TrendingUp, AlertTriangle, Clock, BarChart3, Newspaper, Cpu, History, ChevronRight, ExternalLink, ChevronUp } from "lucide-react"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts"

export default function Dashboard() {
  const { data, loading, error } = useDashboardData()
  const [activeTab, setActiveTab] = useState('flash')

  // Sécurité anti-crash : si pas de données, on affiche un état de chargement propre
  if (loading) return <div className="min-h-screen bg-black flex items-center justify-center text-blue-500">Initialisation du terminal...</div>
  
  // Sécurité si crash de connexion
  if (error) return <div className="min-h-screen bg-black flex items-center justify-center text-red-500">Erreur de liaison satellite : {error.message}</div>

  // Données de secours si la base est vide
  const news = data?.news || []
  const oilData = data?.oil_prices || []
  const alerts = data?.alerts || []

  return (
    <main className="min-h-screen bg-[#020617] text-slate-200 p-4 font-mono selection:bg-blue-500/30">
      {/* En-tête MSIE49 */}
      <header className="flex justify-between items-center mb-6 border-b border-blue-900/50 pb-4">
        <div className="flex items-center gap-3">
          <Globe className="w-6 h-6 text-blue-400 animate-pulse" />
          <div>
            <h1 className="text-xl font-bold tracking-tighter text-blue-100">MSIE49 VENEZUELA VEILLE</h1>
            <p className="text-[10px] text-blue-400/70 uppercase tracking-[0.2em]">Unité Renseignement Stratégique</p>
          </div>
        </div>
        <div className="text-right">
          <div className="text-blue-400 text-sm font-bold flex items-center gap-2">
            <Clock className="w-4 h-4" /> {new Date().toLocaleTimeString()}
          </div>
          <p className="text-[10px] text-blue-500/50">PARIS (FRANCE)</p>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* FLUX NEWS - Gauche */}
        <section className="lg:col-span-4 space-y-4">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-sm font-bold flex items-center gap-2 text-blue-300">
              <Newspaper className="w-4 h-4" /> FLUX NEWS DIRECT
            </h2>
            <span className="text-[10px] bg-green-500/20 text-green-400 px-2 py-0.5 rounded animate-pulse">LIVE</span>
          </div>
          
          <div className="space-y-3 max-h-[70vh] overflow-y-auto pr-2 custom-scrollbar">
            {news.length === 0 ? (
              <p className="text-blue-500/40 text-xs italic">En attente de transmission...</p>
            ) : news.map((item: any) => (
              <a key={item.id} href={item.url} target="_blank" rel="noopener noreferrer" 
                 className="block p-3 rounded-lg border border-blue-900/30 bg-blue-950/20 hover:bg-blue-900/30 transition-all group">
                <div className="flex justify-between text-[10px] text-blue-400/60 mb-1">
                  <span>{item.source} • {item.time}</span>
                  <span className="bg-blue-900/40 px-1 rounded group-hover:text-blue-300">Détails</span>
                </div>
                <h3 className="text-sm font-medium leading-tight group-hover:text-blue-300 transition-colors">{item.title}</h3>
              </a>
            ))}
          </div>
        </section>

        {/* GRAPHIQUES ET ANALYSE - Centre/Droite */}
        <section className="lg:col-span-8 space-y-6">
          {/* Marché Pétrolier */}
          <div className="p-4 rounded-xl border border-blue-900/30 bg-blue-950/20">
             <h2 className="text-sm font-bold mb-4 flex items-center gap-2 text-blue-300">
              <TrendingUp className="w-4 h-4" /> MARCHÉ PÉTROLIER
            </h2>
            <div className="h-48 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={oilData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                  <XAxis dataKey="time" hide />
                  <YAxis hide domain={['auto', 'auto']} />
                  <Tooltip contentStyle={{backgroundColor: '#0f172a', border: '1px solid #1e3a8a'}} />
                  <Line type="monotone" dataKey="price" stroke="#3b82f6" strokeWidth={2} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Onglets Analyse */}
          <div className="border border-blue-900/30 rounded-xl bg-blue-950/20 overflow-hidden">
            <div className="flex border-b border-blue-900/30">
              {['flash', 'rapport', 'alertes'].map((tab) => (
                <button 
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`flex-1 py-3 text-xs font-bold uppercase tracking-wider transition-all ${activeTab === tab ? 'bg-blue-500/20 text-blue-300 border-b-2 border-blue-400' : 'text-slate-500 hover:text-slate-300'}`}
                >
                  {tab === 'flash' && <Cpu className="inline w-3 h-3 mr-2" />}
                  {tab === 'rapport' && <History className="inline w-3 h-3 mr-2" />}
                  {tab === 'alertes' && <AlertTriangle className="inline w-3 h-3 mr-2" />}
                  {tab}
                </button>
              ))}
            </div>
            <div className="p-6 min-h-[300px]">
              {activeTab === 'alertes' && (
                <div className="space-y-4">
                  {alerts.length === 0 ? (
                    <div className="flex items-center justify-center h-48 border-2 border-dashed border-blue-900/20 rounded-lg">
                       <p className="text-blue-900/50">Aucune alerte critique détectée</p>
                    </div>
                  ) : alerts.map((alert: any) => (
                    <div key={alert.id} className="p-4 border-l-4 border-red-500 bg-red-500/10 rounded-r-lg">
                      <h4 className="text-red-400 font-bold text-sm mb-1">{alert.title}</h4>
                      <p className="text-xs text-slate-400">{alert.description}</p>
                    </div>
                  ))}
                </div>
              )}
              {activeTab === 'flash' && <div className="text-sm text-blue-100/80 leading-relaxed italic">Sélectionnez un événement pour générer une synthèse...</div>}
            </div>
          </div>
        </section>
      </div>
    </main>
  )
}
