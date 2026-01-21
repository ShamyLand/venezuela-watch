"use client";

import React, { useState, useEffect } from "react";
import { useDashboardData } from "@/hooks/useDashboardData";
import {
    Globe,
    TrendingUp,
    AlertTriangle,
    Clock,
    BarChart3,
    Newspaper,
    Cpu,
    History,
    ChevronRight,
    ExternalLink,
    ChevronUp
} from "lucide-react";
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell
} from "recharts";

// Mock data as fallback
const OIL_DATA_MOCK = [
    { time: "08:00", brent: 78.5, wti: 74.2 },
    { time: "10:00", brent: 79.2, wti: 75.1 },
    { time: "12:00", brent: 80.1, wti: 76.0 },
    { time: "14:00", brent: 79.8, wti: 75.5 },
    { time: "16:00", brent: 81.2, wti: 77.3 },
    { time: "18:00", brent: 80.7, wti: 76.8 },
];

const PDVSA_EXPORTS = [
    { name: 'Chine', value: 65, color: '#00d4ff' },
    { name: 'Inde', value: 20, color: '#00ff88' },
    { name: 'Autres', value: 15, color: '#ff6b35' },
];

export default function Dashboard() {
    const { news, analysis, oilPrices, loading } = useDashboardData();
    const [activeTab, setActiveTab] = useState("flash");
    const [time, setTime] = useState(new Date());

    useEffect(() => {
        const timer = setInterval(() => setTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    const formatTime = (date: Date) => {
        return date.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    };

    // Helper to format fallback mock news if API fails
    const displayNews = news.length > 0 ? news : [
        { id: 1, title: "Initialisation du flux de données...", source: "Système", published_at: new Date().toISOString(), type: "System", flag: "🟢" }
    ];

    const displayOil = oilPrices.length > 0 ? oilPrices : OIL_DATA_MOCK;

    return (
        <div className="flex flex-col min-h-screen bg-[#0a0e17] text-[#e8e8e8] selection:bg-[#00d4ff] selection:text-[#0a0e17]">
            {/* HEADER */}
            <header className="h-16 border-b border-[#1a1f2e] bg-[#0d1526]/80 backdrop-blur-md px-6 flex items-center justify-between sticky top-0 z-50">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-[#00d4ff]/10 rounded flex items-center justify-center border border-[#00d4ff]/30">
                        <Globe className="w-6 h-6 text-[#00d4ff] animate-pulse" />
                    </div>
                    <div>
                        <h1 className="text-xl font-bold tracking-tighter terminal-text">VENEZUELA WATCH</h1>
                        <div className="flex items-center gap-2 text-[10px] text-[#8892a0] uppercase tracking-widest font-mono">
                            <span className="flex items-center gap-1"><span className={`w-1.5 h-1.5 rounded-full ${loading ? 'bg-yellow-500 animate-bounce' : 'bg-green-500'}`}></span> {loading ? 'SYNCING...' : 'LIVE TERMINAL'}</span>
                            <span className="opacity-30">|</span>
                            <span>STRATEGIC INTEL UNIT</span>
                        </div>
                    </div>
                </div>

                <div className="hidden md:flex items-center gap-8">
                    <div className="flex flex-col items-end">
                        <span className="text-[10px] text-[#8892a0] font-mono uppercase tracking-tighter">Indicateur de tension</span>
                        <div className="w-32 h-2 bg-[#1a1f2e] rounded-full mt-1 overflow-hidden">
                            <div
                                className="h-full bg-gradient-to-r from-yellow-500 to-red-500 transition-all duration-1000"
                                style={{ width: analysis?.report?.indicateurs?.tension_geopolitique ? `${analysis.report.indicateurs.tension_geopolitique * 10}%` : '50%' }}
                            ></div>
                        </div>
                    </div>
                    <div className="flex items-center gap-6 font-mono border-l border-[#1a1f2e] pl-6">
                        <div className="text-right">
                            <span className="block text-[10px] text-[#8892a0]">HEURE LOCALE (VNZ)</span>
                            <span className="text-sm">{formatTime(new Date(time.getTime() - 4 * 60 * 60 * 1000))}</span>
                        </div>
                        <div className="text-right">
                            <span className="block text-[10px] text-[#8892a0]">UTC / GMT</span>
                            <span className="text-sm font-bold text-[#00d4ff]">{formatTime(time)}</span>
                        </div>
                    </div>
                </div>
            </header>

            {/* MAIN CONTENT */}
            <main className="flex-1 p-4 md:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6 max-w-[1600px] mx-auto w-full">

                {/* LEFT COLUMN - NEWS & OIL */}
                <div className="lg:col-span-4 flex flex-col gap-6">

                    {/* WIDGET 1: NEWS FEED */}
                    <div className="glass-card flex flex-col h-[500px]">
                        <div className="p-4 border-b border-[#1a1f2e] flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <Newspaper className="w-4 h-4 text-[#00d4ff]" />
                                <h2 className="text-xs uppercase font-bold tracking-widest font-mono">Flux News Direct</h2>
                            </div>
                            <span className="text-[10px] text-green-500 animate-pulse font-mono flex items-center gap-1">
                                LIVE
                            </span>
                        </div>
                        <div className="flex-1 overflow-y-auto p-2 space-y-2 custom-scrollbar">
                            {displayNews.map((n: any, i: number) => (
                                <div key={i} className="p-3 bg-[#0d1526] hover:bg-[#1a1f2e] transition-colors border-l-2 border-transparent hover:border-[#00d4ff] cursor-pointer group rounded">
                                    <div className="flex justify-between items-start mb-1 text-[10px]">
                                        <span className="text-[#8892a0] font-mono">{n.source_name || n.source} • {new Date(n.published_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                        <span className="px-1.5 py-0.5 bg-[#1a1f2e] text-[#e8e8e8] rounded border border-white/5">{n.category || 'News'}</span>
                                    </div>
                                    <h3 className="text-sm font-medium leading-snug group-hover:text-[#00d4ff] transition-colors line-clamp-2">
                                        {n.title_fr || n.title}
                                    </h3>
                                    <div className="mt-2 flex items-center gap-1 text-[10px] text-[#8892a0]">
                                        <ChevronRight className="w-3 h-3 ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* WIDGET 3: OIL PRICES */}
                    <div className="glass-card p-4">
                        <div className="flex items-center justify-between mb-6">
                            <div className="flex items-center gap-2">
                                <TrendingUp className="w-4 h-4 text-[#00ff88]" />
                                <h2 className="text-xs uppercase font-bold tracking-widest font-mono">Marché Pétrolier</h2>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4 mb-6">
                            <div className="p-3 bg-[#0a0e17] border border-[#1a1f2e] rounded relative overflow-hidden group">
                                <span className="text-[9px] text-[#8892a0] font-mono block mb-1">BRENT CRUDE</span>
                                <div className="flex items-end gap-2">
                                    <span className="text-xl font-bold terminal-text">$81.24</span>
                                    <span className="text-[10px] text-[#00ff88] flex items-center mb-1 font-mono">
                                        <ChevronUp className="w-3 h-3" /> 1.2%
                                    </span>
                                </div>
                            </div>
                            <div className="p-3 bg-[#0a0e17] border border-[#1a1f2e] rounded relative overflow-hidden group">
                                <span className="text-[9px] text-[#8892a0] font-mono block mb-1">WTI CRUDE</span>
                                <div className="flex items-end gap-2">
                                    <span className="text-xl font-bold terminal-text">$77.30</span>
                                    <span className="text-[10px] text-[#00ff88] flex items-center mb-1 font-mono">
                                        <ChevronUp className="w-3 h-3" /> 0.8%
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div className="h-[200px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={displayOil}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#1a1f2e" vertical={false} />
                                    <XAxis dataKey="time" stroke="#4a5568" fontSize={10} tickLine={false} axisLine={false} />
                                    <YAxis hide />
                                    <Tooltip
                                        contentStyle={{ backgroundColor: '#0d1526', borderColor: '#1a1f2e', fontSize: '12px' }}
                                        itemStyle={{ color: '#00d4ff' }}
                                    />
                                    <Line type="monotone" dataKey="brent" stroke="#00d4ff" strokeWidth={2} dot={false} animationDuration={1000} />
                                    <Line type="monotone" dataKey="wti" stroke="#00ff88" strokeWidth={2} dot={false} animationDuration={1000} />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>

                {/* CENTER COLUMN - IA ANALYSIS */}
                <div className="lg:col-span-5 flex flex-col gap-6">

                    <div className="glass-card flex flex-col h-full glow-border">
                        {/* TABS HEADER */}
                        <div className="grid grid-cols-3 border-b border-[#1a1f2e]">
                            <button
                                onClick={() => setActiveTab("flash")}
                                className={`p-4 flex items-center justify-center gap-2 transition-all ${activeTab === 'flash' ? 'bg-[#00d4ff]/10 text-[#00d4ff] border-b-2 border-[#00d4ff]' : 'hover:bg-[#1a1f2e] text-[#8892a0]'}`}
                            >
                                <Cpu className="w-4 h-4" />
                                <span className="text-[10px] font-bold uppercase tracking-tighter">Flash Synthèse</span>
                            </button>
                            <button
                                onClick={() => setActiveTab("report")}
                                className={`p-4 flex items-center justify-center gap-2 transition-all ${activeTab === 'report' ? 'bg-[#00ff88]/10 text-[#00ff88] border-b-2 border-[#00ff88]' : 'hover:bg-[#1a1f2e] text-[#8892a0]'}`}
                            >
                                <BarChart3 className="w-4 h-4" />
                                <span className="text-[10px] font-bold uppercase tracking-tighter">Rapport Détail</span>
                            </button>
                            <button
                                onClick={() => setActiveTab("alerts")}
                                className={`p-4 flex items-center justify-center gap-2 transition-all ${activeTab === 'alerts' ? 'bg-[#ff6b35]/10 text-[#ff6b35] border-b-2 border-[#ff6b35]' : 'hover:bg-[#1a1f2e] text-[#8892a0]'}`}
                            >
                                <History className="w-4 h-4" />
                                <span className="text-[10px] font-bold uppercase tracking-tighter">Alertes</span>
                            </button>
                        </div>

                        <div className="flex-1 overflow-y-auto p-6 space-y-6">
                            {!analysis ? (
                                <div className="flex flex-col items-center justify-center h-full text-[#8892a0]">
                                    <Cpu className="w-8 h-8 animate-pulse mb-4" />
                                    <p className="text-xs uppercase tracking-widest">Initialisation de l'IA...</p>
                                    <p className="text-[10px] mt-2">En attente de données du CRON job</p>
                                </div>
                            ) : (
                                <>
                                    {activeTab === 'flash' && analysis.flash && (
                                        <div className="space-y-6 animate-in fade-in duration-500">
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-2 px-3 py-1 bg-[#00d4ff]/10 text-[#00d4ff] rounded-full border border-[#00d4ff]/20">
                                                    <TrendingUp className="w-3 h-3" />
                                                    <span className="text-[10px] font-bold uppercase">Tendance : {analysis.flash.tendance}</span>
                                                </div>
                                                <span className="text-[10px] text-[#8892a0] font-mono">
                                                    MAJ: {new Date(analysis.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                </span>
                                            </div>

                                            <ul className="space-y-4">
                                                {analysis.flash.points?.map((point: string, i: number) => (
                                                    <li key={i} className="flex gap-3 text-sm border-l-2 border-[#00d4ff] pl-4 py-1">
                                                        <span className="opacity-70">{point}</span>
                                                    </li>
                                                ))}
                                            </ul>

                                            <div className="p-4 bg-[#0d1526] rounded border border-[#1a1f2e] mt-auto">
                                                <p className="text-xs text-[#8892a0] italic">
                                                    "{analysis.flash.tendance_label}"
                                                </p>
                                            </div>
                                        </div>
                                    )}

                                    {activeTab === 'report' && analysis.report && (
                                        <div className="space-y-6 animate-in fade-in duration-500">
                                            <div className="grid grid-cols-3 gap-3">
                                                {[
                                                    { l: 'Tension', v: analysis.report.indicateurs?.tension_geopolitique, c: '#ff3b3b' },
                                                    { l: 'Volatilité', v: analysis.report.indicateurs?.volatilite_petrole, c: '#00d4ff' },
                                                    { l: 'Risque', v: analysis.report.indicateurs?.risque_sanctions, c: '#ff6b35' }
                                                ].map((idx) => (
                                                    <div key={idx.l} className="p-3 bg-[#0a0e17] border border-[#1a1f2e] rounded text-center">
                                                        <span className="block text-[8px] text-[#8892a0] uppercase mb-1">{idx.l}</span>
                                                        <span className="text-lg font-bold" style={{ color: idx.c }}>{idx.v}/10</span>
                                                    </div>
                                                ))}
                                            </div>

                                            <section>
                                                <h4 className="text-[10px] font-bold uppercase text-[#00ff88] mb-2 tracking-widest flex items-center gap-2">
                                                    Analyse Géopolitique
                                                </h4>
                                                <p className="text-xs leading-relaxed text-[#8892a0]">
                                                    {analysis.report.geopolitique}
                                                </p>
                                            </section>

                                            <section>
                                                <h4 className="text-[10px] font-bold uppercase text-[#00ff88] mb-2 tracking-widest flex items-center gap-2">
                                                    Économie & Pétrole
                                                </h4>
                                                <p className="text-xs leading-relaxed text-[#8892a0]">
                                                    {analysis.report.economie_petrole}
                                                </p>
                                            </section>
                                        </div>
                                    )}

                                    {activeTab === 'alerts' && analysis?.alerts && (
                                        <div className="space-y-3 animate-in fade-in duration-500">
                                            {analysis.alerts.length === 0 && <p className="text-xs text-center text-[#8892a0]">Aucune alerte active.</p>}
                                            {analysis.alerts.map((alert: any, i: number) => (
                                                <div key={i} className={`p-3 border rounded flex items-start gap-3 ${alert.niveau === 'CRITIQUE' ? 'bg-[#ff3b3b]/10 border-[#ff3b3b]/30' : 'bg-[#ff6b35]/10 border-[#ff6b35]/30'}`}>
                                                    <AlertTriangle className={`w-5 h-5 mt-1 shrink-0 ${alert.niveau === 'CRITIQUE' ? 'text-[#ff3b3b]' : 'text-[#ff6b35]'}`} />
                                                    <div>
                                                        <h4 className={`text-sm font-bold ${alert.niveau === 'CRITIQUE' ? 'text-[#ff3b3b]' : 'text-[#ff6b35]'}`}>{alert.titre}</h4>
                                                        <p className="text-xs text-[#e8e8e8]/80 mt-1">{alert.description}</p>
                                                        {alert.source_citee && (
                                                            <span className={`text-[9px] font-mono mt-2 block ${alert.niveau === 'CRITIQUE' ? 'text-[#ff3b3b]/60' : 'text-[#ff6b35]/60'}`}>SOURCE: {alert.source_citee}</span>
                                                        )}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </>
                            )}
                        </div>

                        <div className="p-4 border-t border-[#1a1f2e] bg-[#0d1526] flex justify-between items-center text-[10px] font-mono text-[#8892a0]">
                            <span>GÉNÉRATION PROCHAINE : 1H (CRON)</span>
                            <div className="flex gap-4">
                                <button className="hover:text-white transition-colors underline flex items-center gap-1">
                                    EXPORTER PDF <ExternalLink className="w-3 h-3" />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* RIGHT COLUMN - MISC INFO */}
                <div className="lg:col-span-3 flex flex-col gap-6">

                    {/* PDVSA DATA / OPEP */}
                    <div className="glass-card p-4">
                        <h2 className="text-xs uppercase font-bold tracking-widest font-mono mb-4 flex items-center gap-2">
                            <TrendingUp className="w-4 h-4 text-[#00d4ff]" /> Stats PDVSA / OPEP
                        </h2>

                        <div className="h-[150px] mb-4">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={PDVSA_EXPORTS}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={40}
                                        outerRadius={60}
                                        paddingAngle={5}
                                        dataKey="value"
                                    >
                                        {PDVSA_EXPORTS.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.color} />
                                        ))}
                                    </Pie>
                                    <Tooltip
                                        contentStyle={{ backgroundColor: '#0d1526', border: 'none', borderRadius: '4px', fontSize: '10px' }}
                                    />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>

                        <div className="space-y-3">
                            <div className="flex justify-between items-center text-xs">
                                <span className="text-[#8892a0]">Production (BPD)</span>
                                <span className="font-mono text-[#00ff88]">845k ↑</span>
                            </div>
                            <div className="flex justify-between items-center text-xs">
                                <span className="text-[#8892a0]">Sanctions US</span>
                                <span className="font-mono text-[#ff3b3b]">ACTIVES</span>
                            </div>
                            <div className="flex justify-between items-center text-xs">
                                <span className="text-[#8892a0]">Prochaine OPEP+</span>
                                <span className="font-mono text-[#00d4ff]">12 FÉV</span>
                            </div>
                        </div>
                    </div>

                    {/* TIMELINE */}
                    <div className="glass-card flex-1 flex flex-col min-h-[400px]">
                        <div className="p-4 border-b border-[#1a1f2e]">
                            <h2 className="text-xs uppercase font-bold tracking-widest font-mono flex items-center gap-2">
                                <Clock className="w-4 h-4 text-[#8892a0]" /> TIMELINE ÉVÉNEMENTS
                            </h2>
                        </div>
                        <div className="flex-1 overflow-y-auto p-4 relative">
                            <div className="absolute left-6 top-4 bottom-4 w-px bg-[#1a1f2e]"></div>
                            {/* Note: Timeline could also be dynamic from news history if needed, for now static as requested */}
                            {[
                                { time: '16:45', icon: '📢', title: 'Déclaration Maduro TV' },
                                { time: '14:20', icon: '🛢️', title: 'Panne Port Jose' },
                                { time: '11:05', icon: '📊', title: 'Rapport production EIA' },
                                { time: '09:30', icon: '🤝', title: 'Accord Chevron-PDVSA' },
                                { time: 'HIER', icon: '📉', title: 'Baisse cours du Brent' },
                            ].map((ev, i) => (
                                <div key={i} className="relative pl-8 pb-6 group">
                                    <div className="absolute left-[-2px] top-1.5 w-2 h-2 rounded-full bg-[#1a1f2e] group-hover:bg-[#00d4ff] z-10 transition-colors"></div>
                                    <div className="text-[10px] font-mono text-[#8892a0] mb-1">{ev.time}</div>
                                    <div className="text-xs flex items-center gap-2 hover:text-[#00d4ff] cursor-pointer transition-colors">
                                        <span>{ev.icon}</span>
                                        <span className="font-medium">{ev.title}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                </div>

            </main>

            {/* FOOTER / STATUS BAR */}
            <footer className="h-10 border-t border-[#1a1f2e] bg-[#0d1526] px-6 flex items-center justify-between text-[10px] font-mono text-[#4a5568]">
                <div className="flex gap-6">
                    <span className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-green-500"></span> API: CONNECTED</span>
                    <span className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-green-500"></span> DB: SYNC</span>
                    <span className="hidden md:inline">SYSTEM STATUS: OPTIMAL</span>
                </div>
                <div className="flex gap-4">
                    <span className="text-[#8892a0]">V1.0.4-BETA</span>
                    <span className="text-[#00d4ff]">© 2026 VENEZUELA WATCH</span>
                </div>
            </footer>

            <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #1a1f2e;
          border-radius: 2px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #4a5568;
        }
      `}</style>
        </div>
    );
}
