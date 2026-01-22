"use client"

import { useEffect, useState } from "react"
import { useDashboardData } from "@/hooks/useDashboardData"
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts"
import { Download, Shield, Activity, Globe, Clock, Zap } from "lucide-react"

export default function Dashboard() {
  const { data, loading } = useDashboardData()
  const [activeTab, setActiveTab] = useState('flash')
  const [times, setTimes] = useState({ paris: "--:--:--", caracas: "--:--:--" })

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

  // Fonction d'exportation PDF
  const handleExportPDF = () => { window.print(); }

  if (loading) return <div className="min-h-screen bg-[#0a0e17] flex items-center justify-center text-[#00d4ff] font-mono animate-pulse uppercase tracking-widest">Initialisation MSIE49...</div>
  
  const news = data?.news || []
  const oilData = data?.oil_prices?.map((d: any) => ({
    time: new Date(d.timestamp).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
    price: parseFloat(d.price)
  })).reverse() || []
  
  const analysis = data?.analyses?.[0] || { flash_json: {}, report_json: {}, alerts_json: [] }
  
  // LOGIQUE DYNAMIQUE : On récupère les notes calculées par Gemini
  const report = analysis.report_json || {}
  const scores = {
    tension: report.tension || 0,
    volatility: report.volatility || 0,
    risk: report.risk || 0
  }
  const averageTension = ((scores.tension + scores.volatility + scores.risk) / 3).toFixed(1)

  const pdvsaData = [{ name: 'Chine', value: 65 }, { name: 'Inde', value: 20 }, { name: 'Autres', value: 15 }]
  const COLORS = ['#00d4ff', '#00ff88', '#ff6b35']

  return (
    <div className="min-h-screen bg-[#0a0e17] text-[#e8e8e8] font-sans selection:bg-[#00d4ff] selection:text-[#0a0e17] print:bg-white print:text-black">
      
      {/* HEADER AVEC JAUGE DYNAMIQUE */}
      <header className="h-20 border-b border-[#00d4ff1a] bg-[#0d1526d9] backdrop-blur-md flex items-center justify-between px-6 sticky top-0 z-50 print:hidden">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-[#00d4ff1a] border border-[#00d4ff4d] rounded-lg flex items-center justify-center text-2xl animate-pulse-glow">🌍</div>
          <div>
            <h1 className="text-xl font-black tracking-tighter bg-gradient-to-r from-white to-[#00d4ff] bg-clip-text text-fill-transparent uppercase terminal-text italic">MSIE49 VENEZUELA VEILLE</h1>
            <div className="flex items-center gap-2 text-[9px] text-[#8892a0] tracking-widest font-mono font-bold">
              <span className="w-2 h-2 bg-[#00ff88] rounded-full animate-terminal-blink" /> UNITÉ RENSEIGNEMENT STRATÉGIQUE
            </div>
          </div>
        </div>

        {/* JAUGE DE TENSION CALCULÉE PAR GEMINI */}
        <div className="hidden lg:flex items-center gap-6 px-8 border-l border-white/10 h-10">
          <div className="text-right">
            <span className="block text-[8px] text-[#8892a0] uppercase font-bold mb-1">Tension Globale (IA)</span>
            <div className="w-48 h-1.5 bg-white/5 border border-white/10 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-[#00d4ff] to-[#ff3b3b] transition-all duration-1000 shadow-[0_0_10px_rgba(255,59,59,0.3)]"
                style={{ width: `${Number(averageTension) * 10}%` }}
              />
            </div>
          </div>
          <div className="text-xl font-black font-mono text-[#ff3b3b] drop-shadow-[0_0_5px_rgba(255,59,59,0.5)]">{averageTension}</div>
        </div>

        <div className="flex items-center gap-8 border-l border-white/10 pl-8 font-mono">
          <div className="text-right">
            <span className="block text-[9px] text-[#8892a0]">CARACAS</span>
            <span className="text-base font-black text-[#00d4ff] tracking-tighter">{times.caracas}</span>
          </div>
          <div className="text-right">
            <span className="block text-[9px] text-[#8892a0]">PARIS</span>
            <span className="text-base font-black text-[#00d4ff]">{times.paris}</span>
          </div>
        </div>
      </header>

      {/* ZONE D'EXPORTATION PDF (Visible uniquement lors du Print) */}
      <div className="hidden print:block p-12 font-serif">
        <h1 className="text-4xl font-bold mb-2">SYNTHÈSE STRATÉGIQUE VENEZUELA</h1>
        <p className="text-slate-500 mb-8 font-mono italic">Document généré le {new Date().toLocaleDateString()} par MSIE49 IA</p>
        <div className="mb-8 p-6 bg-slate-50 border-l-4 border-blue-500 italic text-xl">
           "{analysis.flash_json?.content}"
        </div>
        <h2 className="text-2xl font-bold border-b pb-2 mb-4">Indicateurs de Risque</h2>
        <p className="mb-8">Tension: {scores.tension}/10 | Volatilité: {scores.volatility}/10 | Risque Global: {scores.risk}/10</p>
        <h2 className="text-2xl font-bold border-b pb-2 mb-4">Analyse Détaillée</h2>
        <p className="leading-relaxed text-justify">{report.content}</p>
      </div>

      <main className="p-6 grid grid-cols-12 gap-6 max-w-[1700px] mx-auto print:hidden">
        
        {/* COLONNE GAUCHE : NEWS */}
        <section className="col-span-12 lg:col-span-4 glass-card rounded-2xl overflow-hidden flex flex-col h-[550px]">
          <div className="p-5 bg-black/20 border-b border-white/5 flex justify-between items-center">
            <h2 className="text-xs font-black tracking-widest font-mono uppercase italic flex items-center gap-2"><Activity className="w-4 h-4" /> Flux News</h2>
            <span className="text-[10px] text-[#00ff88] animate-pulse">LIVE</span>
          </div>
          <div className="flex-1 overflow-y-auto p-3 space-y-3 custom-scrollbar">
            {news.map((item: any) => (
              <a key={item.id} href={item.url} target="_blank" className="news-item-antigravity block p-4 rounded-xl border border-transparent">
                <div className="flex justify-between text-[10px] mb-2 font-mono font-bold">
                  <span className="text-[#00d4ff]">{item.source_name} • {new Date(item.published_at).toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'})}</span>
                  <span className="text-[#8892a0] uppercase border border-white/10 px-1.5 rounded">{item.category}</span>
                </div>
                <h3 className="text-[13px] font-semibold leading-relaxed">{item.title_fr || item.title_original}</h3>
              </a>
            ))}
          </div>
        </section>

        {/* COLONNE CENTRALE : ANALYSE ET PDF */}
        <section className="col-span-12 lg:col-span-8 space-y-6">
          <div className="glass-card rounded-2xl overflow-hidden flex flex-col min-h-[550px]">
            <div className="flex justify-between items-center bg-blue-900/10 border-b border-white/10 pr-4">
              <div className="flex">
                {['flash', 'report', 'alerts'].map((tab) => (
                  <button key={tab} onClick={() => setActiveTab(tab)} className={`p-5 text-[10px] font-black uppercase tracking-widest transition-all relative ${activeTab === tab ? 'text-[#00d4ff]' : 'text-[#8892a0]'}`}>
                    {tab === 'flash' ? '⚡ Flash' : tab === 'report' ? '📋 Rapport' : '🚨 Alertes'}
                    {activeTab === tab && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-[#00d4ff] shadow-[0_0_10px_#00d4ff]" />}
                  </button>
                ))}
              </div>
              <button 
                onClick={handleExportPDF} 
                className="flex items-center gap-2 px-4 py-2 bg-[#00d4ff11] border border-[#00d4ff44] rounded-lg text-[10px] font-bold text-[#00d4ff] hover:bg-[#00d4ff22] transition-all"
              >
                <Download className="w-4 h-4" /> EXPORTER PDF
              </button>
            </div>

            <div className="p-8 flex-1">
              {activeTab === 'flash' && (
                <div className="animate-in fade-in duration-700">
                  <div className="p-8 border-l-4 border-[#00d4ff] bg-gradient-to-r from-[#00d4ff0a] to-transparent text-xl leading-relaxed italic font-medium">
                    "{analysis.flash_json?.content || "Synchronisation du signal..."}"
                  </div>
                </div>
              )}
              
              {activeTab === 'report' && (
                <div className="animate-in slide-in-from-bottom-4 duration-500">
                  <div className="grid grid-cols-3 gap-4 mb-10">
                    <div className="p-5 bg-[#0a0e17] border border-white/10 rounded-xl text-center">
                      <div className="text-[9px] font-bold text-[#8892a0] uppercase mb-2">Tension</div>
                      <div className="text-3xl font-black text-[#ff3b3b] font-mono">{scores.tension || '--'}</div>
                    </div>
                    <div className="p-5 bg-[#0a0e17] border border-white/10 rounded-xl text-center">
                      <div className="text-[9px] font-bold text-[#8892a0] uppercase mb-2">Volatilité</div>
                      <div className="text-3xl font-black text-[#00d4ff] font-mono">{scores.volatility || '--'}</div>
                    </div>
                    <div className="p-5 bg-[#0a0e17] border border-white/10 rounded-xl text-center">
                      <div className="text-[9px] font-bold text-[#8892a0] uppercase mb-2">Risque</div>
                      <div className="text-3xl font-black text-[#ff6b35] font-mono">{scores.risk || '--'}</div>
                    </div>
                  </div>
                  <p className="text-[14px] leading-relaxed text-[#c0c8d6] font-medium whitespace-pre-wrap p-6 bg-white/5 rounded-2xl border border-white/5">
                    {report.content || "Analyse stratégique en cours de génération..."}
                  </p>
                </div>
              )}
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}
