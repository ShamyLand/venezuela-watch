"use client"

import { useEffect, useState } from "react"
import { useDashboardData } from "@/hooks/useDashboardData"
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts"

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

  if (loading) return <div className="min-h-screen bg-[#0a0e17] flex items-center justify-center text-[#00d4ff] font-mono animate-pulse">LIAISON SATELLITE...</div>
  
  const news = data?.news || []
  const oilData = data?.oil_prices?.map((d: any) => ({
    time: new Date(d.timestamp).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
    price: parseFloat(d.price)
  })).reverse() || []
  
  const analysis = data?.analyses?.[0] || { flash_json: {}, report_json: {}, alerts_json: [] }
  const pdvsaData = [{ name: 'Chine', value: 65 }, { name: 'Inde', value: 20 }, { name: 'Autres', value: 15 }]
  const COLORS = ['#00d4ff', '#00ff88', '#ff6b35']

  return (
    <div className="min-h-screen bg-[#0a0e17] text-[#e8e8e8] font-sans selection:bg-[#00d4ff] selection:text-[#0a0e17]">
      
      {/* HEADER D'ORIGINE */}
      <header className="h-16 border-b border-[#00d4ff1a] bg-[#0d1526d9] backdrop-blur-md flex items-center justify-between px-6 sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <div className="logo-icon w-10 h-10 bg-[#00d4ff1a] border border-[#00d4ff4d] rounded-lg flex items-center justify-center text-2xl animate-pulse-glow">🌍</div>
          <div>
            <h1 className="text-xl font-black tracking-tighter bg-gradient-to-r from-white to-[#00d4ff] bg-clip-text text-fill-transparent uppercase terminal-text italic">MSIE49 VENEZUELA VEILLE</h1>
            <div className="status-line flex items-center gap-2 text-[10px] text-[#8892a0] tracking-widest font-mono">
              <span className="status-dot w-1.5 h-1.5 bg-[#00ff88] rounded-full animate-terminal-blink shadow-[0_0_8px_#00ff88]" /> TERMINAL EN DIRECT | UNITÉ RENSEIGNEMENT STRATÉGIQUE
            </div>
          </div>
        </div>
        <div className="time-section flex items-center gap-6 border-l border-white/10 pl-6 font-mono">
          <div className="time-block text-right">
            <span className="time-label block text-[10px] text-[#8892a0]">CARACAS (VNZ)</span>
            <span className="time-value text-sm font-bold text-[#00d4ff]">{times.caracas}</span>
          </div>
          <div className="time-block text-right">
            <span className="time-label block text-[10px] text-[#8892a0]">PARIS (FRANCE)</span>
            <span className="time-value text-sm font-bold text-[#00d4ff]">{times.paris}</span>
          </div>
        </div>
      </header>

      {/* MAIN CONTENT */}
      <main className="p-6 grid grid-cols-12 gap-6 max-w-[1600px] mx-auto">
        
        {/* FLUX NEWS (G) */}
        <section className="col-span-12 lg:col-span-4 glass-card rounded-xl overflow-hidden flex flex-col h-[500px]">
          <div className="card-header p-4 bg-black/20 border-b border-white/5 flex justify-between items-center">
            <h2 className="card-title text-xs font-bold tracking-widest font-mono uppercase flex items-center gap-2">📰 Flux News Direct</h2>
            <span className="live-badge text-[10px] text-[#00ff88] font-mono animate-terminal-blink">LIVE</span>
          </div>
          <div className="news-list flex-1 overflow-y-auto p-2 space-y-2 custom-scrollbar">
            {news.map((item: any) => (
              <a key={item.id} href={item.url} target="_blank" className="news-item-antigravity block p-3 rounded">
                <div className="news-meta flex justify-between text-[10px] mb-1 font-mono">
                  <span className="news-source text-[#8892a0]">{item.source_name} • {new Date(item.published_at).toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'})}</span>
                  <span className="news-category px-1.5 py-0.5 bg-white/5 border border-white/10 rounded uppercase">{item.category}</span>
                </div>
                <h3 className="news-title text-sm font-medium leading-snug">{item.title_fr || item.title_original}</h3>
              </a>
            ))}
          </div>
        </section>

        {/* AI PANEL (C) */}
        <section className="col-span-12 lg:col-span-5 glass-card glow-border rounded-xl overflow-hidden flex flex-col min-h-[500px]">
          <div className="tabs grid grid-cols-3 border-b border-white/10">
            {['flash', 'report', 'alerts'].map((tab) => (
              <button key={tab} onClick={() => setActiveTab(tab)} className={`tab p-4 text-[10px] font-bold uppercase tracking-widest transition-all ${activeTab === tab ? 'active' : ''}`}>
                {tab === 'flash' ? '💻 Flash Synthèse' : tab === 'report' ? '📊 Rapport Détail' : '⏰ Alertes'}
              </button>
            ))}
          </div>
          <div className="tab-content p-6 flex-1">
            {activeTab === 'flash' && (
              <div className="animate-in fade-in duration-500">
                <div className="flex justify-between items-center mb-6">
                  <span className="flash-badge inline-flex items-center gap-2 px-3 py-1.5 bg-[#00d4ff1a] text-[#00d4ff] border border-[#00d4ff4d] rounded-full text-[10px] font-bold uppercase">📈 Tendance : MODÉRÉE POSITIVE</span>
                  <span className="text-[10px] text-[#8892a0] font-mono italic">MAJ: 16:30</span>
                </div>
                <ul className="flash-list space-y-4">
                   <li className="flash-item p-3 border-l-2 border-[#00d4ff] bg-gradient-to-r from-[#00d4ff0d] to-transparent text-sm leading-relaxed">
                     {analysis.flash_json?.content || "Réception des signaux en cours..."}
                   </li>
                </ul>
                <div className="flash-quote p-4 bg-[#0d152666] border border-white/10 rounded-lg mt-6 text-xs text-[#b0b8c6] italic">
                   "La situation géopolitique reste fragile mais les indicateurs économiques montrent des signes d'amélioration progressive."
                </div>
              </div>
            )}
            {activeTab === 'report' && (
              <div className="animate-in slide-in-from-bottom-2 duration-500">
                <div className="indicators grid grid-cols-3 gap-3 mb-8">
                  <div className="indicator p-4 bg-[#0a0e1780] border border-white/10 rounded text-center">
                    <div className="indicator-label text-[8px] text-[#8892a0] uppercase mb-1">Tension</div>
                    <div className="indicator-value text-2xl font-bold font-mono" style={{ color: '#ff3b3b' }}>7/10</div>
                  </div>
                  <div className="indicator p-4 bg-[#0a0e1780] border border-white/10 rounded text-center">
                    <div className="indicator-label text-[8px] text-[#8892a0] uppercase mb-1">Volatilité</div>
                    <div className="indicator-value text-2xl font-bold font-mono" style={{ color: '#00d4ff' }}>6/10</div>
                  </div>
                  <div className="indicator p-4 bg-[#0a0e1780] border border-white/10 rounded text-center">
                    <div className="indicator-label text-[8px] text-[#8892a0] uppercase mb-1">Risque</div>
                    <div className="indicator-value text-2xl font-bold font-mono" style={{ color: '#ff6b35' }}>8/10</div>
                  </div>
                </div>
                <div className="report-section mb-6">
                  <h4 className="section-title text-[10px] font-bold uppercase tracking-[2px] text-[#00ff88] mb-3">Analyse Géopolitique</h4>
                  <p className="section-text text-xs leading-[1.8] text-[#c0c8d6]">{analysis.report_json?.content || "Analyse détaillée en attente."}</p>
                </div>
              </div>
            )}
            {activeTab === 'alerts' && (
              <div className="space-y-3">
                {analysis.alerts_json?.map((a: any, i: number) => (
                  <div key={i} className={`alert p-4 border rounded-lg flex gap-4 ${i === 0 ? 'alert-critical' : 'alert-warning'}`}>
                    <span className="alert-icon text-xl">{i === 0 ? '⚠️' : '⚡'}</span>
                    <div>
                      <h4 className="alert-title text-sm font-bold mb-1" style={{ color: i === 0 ? '#ff3b3b' : '#ff6b35' }}>{a.title}</h4>
                      <p className="alert-desc text-xs text-[#e0e0e0] leading-snug">{a.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* RIGHT COLUMN (D) */}
        <section className="col-span-12 lg:col-span-3 space-y-6">
          <div className="glass-card oil-widget rounded-xl p-4">
            <div className="card-header border-b border-white/5 mb-4 pb-2">
              <h2 className="card-title text-[10px] font-bold uppercase tracking-widest font-mono">📈 Marché Pétrolier</h2>
            </div>
            <div className="oil-prices grid grid-cols-2 gap-3 mb-4">
              <div className="oil-card p-3 bg-[#0a0e1780] border border-white/5 rounded-lg">
                <span className="oil-label block text-[8px] text-[#8892a0] font-mono mb-1">BRENT</span>
                <span className="oil-value text-xl font-bold font-mono">$81.24</span> <span className="oil-change text-[9px] text-[#00ff88]">▲</span>
              </div>
              <div className="oil-card p-3 bg-[#0a0e1780] border border-white/5 rounded-lg">
                <span className="oil-label block text-[8px] text-[#8892a0] font-mono mb-1">WTI</span>
                <span className="oil-value text-xl font-bold font-mono">$77.30</span> <span className="oil-change text-[9px] text-[#00ff88]">▲</span>
              </div>
            </div>
            <div className="h-[150px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={oilData}>
                  <Area type="monotone" dataKey="price" stroke="#00d4ff" fill="#00d4ff1a" strokeWidth={2} />
                  <XAxis dataKey="time" stroke="#4a5568" fontSize={10} axisLine={false} tickLine={false} dy={10} />
                  <YAxis hide domain={['auto', 'auto']} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="glass-card pdvsa-widget rounded-xl p-4">
            <h2 className="card-title text-[10px] font-bold uppercase tracking-widest mb-4 font-mono">📊 Stats PDVSA / OPEP</h2>
            <div className="h-[120px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={pdvsaData} innerRadius={35} outerRadius={50} paddingAngle={5} dataKey="value">
                    {pdvsaData.map((entry, index) => <Cell key={index} fill={COLORS[index % COLORS.length]} />)}
                  </Pie>
                  <Tooltip contentStyle={{backgroundColor:'#0a0e17', border:'1px solid #ffffff1a', fontSize:'10px'}} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="pdvsa-stats mt-4 space-y-2 font-mono text-xs">
              <div className="stat-row flex justify-between">
                <span className="stat-label text-[#8892a0]">Production (BPD)</span>
                <span className="stat-value text-[#00ff88] font-bold">845k ↑</span>
              </div>
              <div className="stat-row flex justify-between">
                <span className="stat-label text-[#8892a0]">Sanctions US</span>
                <span className="stat-value text-[#ff3b3b] font-bold tracking-widest uppercase">Actives</span>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* FOOTER */}
      <footer className="footer h-10 border-t border-white/10 bg-[#0d1526f2] flex items-center justify-between px-6 text-[10px] font-mono text-[#4a5568]">
        <div className="footer-left flex gap-6 italic">
          <span className="footer-status flex items-center gap-1.5"><span className="footer-dot w-1.5 h-1.5 bg-[#00ff88] rounded-full shadow-[0_0_5px_#00ff88]" /> API: CONNECTÉE</span>
          <span className="footer-status flex items-center gap-1.5"><span className="footer-dot w-1.5 h-1.5 bg-[#00ff88] rounded-full shadow-[0_0_5px_#00ff88]" /> BDD: SYNCHRO</span>
        </div>
        <div className="flex gap-4">
          <span>V1.0.4-BETA</span>
          <span className="text-[#00d4ff]">© 2026 VENEZUELA WATCH</span>
        </div>
      </footer>
    </div>
  )
}
