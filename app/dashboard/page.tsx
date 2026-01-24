"use client";

// Force dynamic rendering (required for Supabase data fetching)
export const dynamic = 'force-dynamic';

import React, { useState, useEffect } from "react";
import { useDashboardData } from "@/hooks/useDashboardData";
import NewsTicker from "../components/NewsTicker";
import SocialMediaFeed from "../components/SocialMediaFeed";
import YouTubeVideos from "../components/YouTubeVideos";
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
    ChevronUp,
    FileDown
} from "lucide-react";
import {
    LineChart,
    Line,
    AreaChart,
    Area,
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
    const { news, analysis, oilPrices, loading, lastUpdate, refreshData } = useDashboardData();
    const [activeTab, setActiveTab] = useState("flash");
    const [times, setTimes] = useState({ paris: "--:--:--", caracas: "--:--:--" });
    const [selectedNews, setSelectedNews] = useState<any>(null);
    const [timelineScrollPosition, setTimelineScrollPosition] = useState(0);
    const timelineRef = React.useRef<HTMLDivElement>(null);
    const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);

    // Calculate time since last update
    const getTimeSinceUpdate = () => {
        const now = new Date();
        const diff = now.getTime() - lastUpdate.getTime();
        const minutes = Math.floor(diff / 60000);
        const hours = Math.floor(minutes / 60);

        if (hours > 0) return `il y a ${hours}h ${minutes % 60}min`;
        if (minutes > 0) return `il y a ${minutes}min`;
        return "à l'instant";
    };

    const scrollTimeline = (direction: 'left' | 'right') => {
        if (timelineRef.current) {
            const scrollAmount = 400;
            const newPosition = direction === 'left'
                ? timelineScrollPosition - scrollAmount
                : timelineScrollPosition + scrollAmount;
            timelineRef.current.scrollTo({ left: newPosition, behavior: 'smooth' });
            setTimelineScrollPosition(newPosition);
        }
    };

    useEffect(() => {
        const timer = setInterval(() => {
            const now = new Date();
            const formatTimezone = (tz: string) =>
                new Intl.DateTimeFormat('fr-FR', {
                    hour: '2-digit',
                    minute: '2-digit',
                    second: '2-digit',
                    timeZone: tz,
                    hour12: false
                }).format(now);

            setTimes({
                paris: formatTimezone('Europe/Paris'),
                caracas: formatTimezone('America/Caracas')
            });
        }, 1000);
        return () => clearInterval(timer);
    }, []);

    // Calculate average tension score from AI analysis
    const calculateAverageTension = () => {
        if (!analysis?.report) return 5.0;
        const scores = analysis.report;
        const tension = scores.tension || scores.indicateurs?.tension_geopolitique || 0;
        const volatility = scores.volatility || scores.indicateurs?.volatilite_petrole || 0;
        const risk = scores.risk || scores.indicateurs?.risque_sanctions || 0;
        return ((tension + volatility + risk) / 3).toFixed(1);
    };

    // Handle PDF Export
    const handleExportPDF = async () => {
        setIsGeneratingPDF(true);
        try {
            // Dynamically import PDF service (client-side only)
            const { generateVenezuelaPDF } = await import('@/lib/pdf-service');

            // Fetch PDF summary data from API
            const response = await fetch('/api/generate-pdf-summary', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error('Échec de génération de la synthèse PDF');
            }

            const pdfData = await response.json();

            // Generate and download PDF
            await generateVenezuelaPDF(pdfData);

            // Success notification (could be enhanced with a toast library)
            alert('✅ Rapport PDF généré avec succès !');
        } catch (error) {
            console.error('Erreur lors de la génération du PDF:', error);
            alert('❌ Erreur lors de la génération du PDF. Veuillez réessayer.');
        } finally {
            setIsGeneratingPDF(false);
        }
    };


    // Helper to format fallback mock news if API fails
    const displayNews = news && news.length > 0 ? news : [
        { id: 1, title: "Initialisation du flux de données...", source: "Système", published_at: new Date().toISOString(), type: "System", flag: "🟢" }
    ];

    const displayOil = oilPrices && oilPrices.length > 0 ? oilPrices : OIL_DATA_MOCK;
    const avgTension = calculateAverageTension();

    return (
        <div className="flex flex-col min-h-screen text-[#e8e8e8] selection:bg-[#00d4ff] selection:text-[#0a0e17]">
            {/* BREAKING NEWS TICKER */}
            {analysis?.alerts && <NewsTicker alerts={analysis.alerts} />}
            {/* HEADER */}
            <header className="h-24 border-b border-[#00d4ff1a] bg-[#0d1526d9] backdrop-blur-md px-6 flex items-center justify-between sticky top-0 z-50">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-[#00d4ff1a] border border-[#00d4ff4d] rounded-lg flex items-center justify-center text-2xl animate-pulse-glow">
                        🌍
                    </div>
                    <div>
                        <h1 className="text-xl font-black tracking-tighter bg-gradient-to-r from-white to-[#00d4ff] bg-clip-text text-transparent uppercase terminal-text italic">
                            MSIE49 VENEZUELA WATCH
                        </h1>
                        <div className="text-[9px] text-[#8892a0] font-mono font-bold flex items-center gap-2">
                            <span className="w-2 h-2 bg-[#00ff88] rounded-full animate-terminal-blink"></span>
                            TERMINAL EN DIRECT
                            <span className="opacity-30">|</span>
                            UNITÉ RENSEIGNEMENT STRATÉGIQUE
                        </div>
                        {/* PROMINENT UPDATE INDICATOR */}
                        <div className="mt-1 flex items-center gap-2 text-[10px]">
                            <div className="flex items-center gap-1.5 px-2 py-1 bg-[#00ff88]/10 border border-[#00ff88]/30 rounded-md">
                                <Clock className="w-3 h-3 text-[#00ff88] animate-pulse" />
                                <span className="text-[#00ff88] font-bold">Mis à jour {getTimeSinceUpdate()}</span>
                            </div>
                            <span className="text-[8px] text-[#8892a0]">
                                {lastUpdate.toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit' })} à {lastUpdate.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                            </span>
                        </div>
                    </div>
                </div>

                <div className="hidden lg:flex items-center gap-6 px-8 border-l border-white/10 h-10">
                    <div className="text-right">
                        <span className="block text-[8px] text-[#8892a0] uppercase font-bold mb-1">Tension Moyenne</span>
                        <div className="w-48 h-1.5 bg-white/5 border border-white/10 rounded-full overflow-hidden">
                            <div
                                className="h-full bg-gradient-to-r from-[#00d4ff] to-[#ff3b3b] transition-all duration-1000"
                                style={{ width: `${Number(avgTension) * 10}%` }}
                            />
                        </div>
                    </div>
                    <div className="text-xl font-black font-mono text-red-500">{avgTension}</div>
                </div>

                <div className="flex gap-8 font-mono text-right">
                    <div>
                        <span className="block text-[9px] text-[#8892a0] font-bold">CARACAS</span>
                        <span className="text-base font-black text-[#00d4ff]">{times.caracas}</span>
                    </div>
                    <div>
                        <span className="block text-[9px] text-[#8892a0] font-bold">PARIS</span>
                        <span className="text-base font-black text-[#00d4ff]">{times.paris}</span>
                    </div>
                </div>
            </header>

            {/* MAIN CONTENT */}
            <main className="flex-1 p-4 md:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6 max-w-[1600px] mx-auto w-full">

                {/* LEFT COLUMN - NEWS & OIL */}
                <div className="lg:col-span-4 flex flex-col gap-6">

                    {/* WIDGET 1: NEWS FEED */}
                    <div className="glass-card flex flex-col h-[500px]">
                        <div className="p-5 bg-black/20 border-b border-white/5 flex items-center justify-between">
                            <h2 className="text-xs font-black uppercase tracking-widest terminal-text italic flex items-center gap-2">
                                📰 Flux News Direct
                            </h2>
                            <span className="text-[10px] text-[#00ff88] font-mono animate-terminal-blink">LIVE</span>
                        </div>
                        <div className="flex-1 overflow-y-auto p-3 space-y-3 custom-scrollbar">
                            {displayNews.map((n: any, i: number) => {
                                const newsDate = new Date(n.published_at);
                                const formattedDate = newsDate.toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric' });
                                const formattedTime = newsDate.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });

                                // Google Search fallback pour éviter les 404
                                const googleSearchUrl = `https://www.google.com/search?q=${encodeURIComponent(n.title_fr || n.title)}`;

                                return (
                                    <div
                                        key={i}
                                        onClick={() => window.open(googleSearchUrl, '_blank')}
                                        className="news-item-antigravity block p-4 rounded-xl border border-transparent hover:border-[#00d4ff4d] hover:scale-[1.02] transition-all cursor-pointer"
                                    >
                                        <div className="flex justify-between items-start mb-2 text-[10px]">
                                            <span className="text-[#00d4ff] font-bold font-mono">
                                                {n.source_name || n.source} • {formattedDate} à {formattedTime}
                                            </span>
                                            <span className="px-2 py-0.5 bg-[#1a1f2e] text-[#ccc] rounded border border-white/10 text-[9px]">{n.category || 'Actualité'}</span>
                                        </div>
                                        <h3 className="text-[13px] font-semibold leading-snug line-clamp-2">
                                            {n.title_fr || n.title}
                                        </h3>
                                        <div className="mt-2 flex items-center gap-1 text-[9px] text-[#00ff88]">
                                            <ExternalLink className="w-3 h-3" />
                                            <span>Rechercher sur Google</span>
                                        </div>
                                    </div>
                                );
                            })}
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

                        {/* TREND INDICATORS - NEW VISUALIZATION */}
                        <div className="space-y-4">
                            <div className="p-4 bg-[#0d1526] border border-[#1a1f2e] rounded-lg">
                                <div className="flex items-center justify-between mb-3">
                                    <span className="text-xs text-[#8892a0] font-mono">BRENT - Tendance 7 jours</span>
                                    <span className="text-xs text-[#00ff88] font-bold">+3.2%</span>
                                </div>
                                <div className="flex items-center gap-1 h-12">
                                    {[79.1, 78.8, 79.5, 80.2, 80.8, 81.0, 81.24].map((val, i) => {
                                        const height = ((val - 78) / 4) * 100;
                                        return (
                                            <div key={i} className="flex-1 flex flex-col justify-end h-full">
                                                <div
                                                    className="w-full bg-gradient-to-t from-[#00d4ff] to-[#00d4ff]/40 rounded-t transition-all hover:opacity-80"
                                                    style={{ height: `${height}%` }}
                                                    title={`$${val}`}
                                                />
                                            </div>
                                        );
                                    })}
                                </div>
                                <div className="flex justify-between mt-2 text-[8px] text-[#8892a0] font-mono">
                                    <span>J-6</span>
                                    <span>J-3</span>
                                    <span>Aujourd'hui</span>
                                </div>
                            </div>

                            <div className="p-4 bg-[#0d1526] border border-[#1a1f2e] rounded-lg">
                                <div className="flex items-center justify-between mb-3">
                                    <span className="text-xs text-[#8892a0] font-mono">WTI - Tendance 7 jours</span>
                                    <span className="text-xs text-[#00ff88] font-bold">+2.8%</span>
                                </div>
                                <div className="flex items-center gap-1 h-12">
                                    {[75.2, 75.0, 75.8, 76.4, 76.9, 77.1, 77.30].map((val, i) => {
                                        const height = ((val - 74.5) / 4) * 100;
                                        return (
                                            <div key={i} className="flex-1 flex flex-col justify-end h-full">
                                                <div
                                                    className="w-full bg-gradient-to-t from-[#00ff88] to-[#00ff88]/40 rounded-t transition-all hover:opacity-80"
                                                    style={{ height: `${height}%` }}
                                                    title={`$${val}`}
                                                />
                                            </div>
                                        );
                                    })}
                                </div>
                                <div className="flex justify-between mt-2 text-[8px] text-[#8892a0] font-mono">
                                    <span>J-6</span>
                                    <span>J-3</span>
                                    <span>Aujourd'hui</span>
                                </div>
                            </div>

                            {/* Market Summary */}
                            <div className="grid grid-cols-2 gap-3 text-[10px]">
                                <div className="p-2 bg-[#0a0e17] border border-[#1a1f2e] rounded">
                                    <span className="text-[#8892a0] block mb-1">Variation Jour</span>
                                    <span className="text-[#00ff88] font-bold">↑ $0.97</span>
                                </div>
                                <div className="p-2 bg-[#0a0e17] border border-[#1a1f2e] rounded">
                                    <span className="text-[#8892a0] block mb-1">Volume</span>
                                    <span className="text-white font-bold">Élevé</span>
                                </div>
                            </div>
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
                                                    <span className="text-[10px] font-bold uppercase">Tendance : {analysis.flash.tendance || 'MODÉRÉE'}</span>
                                                </div>
                                                <span className="text-[10px] text-[#8892a0] font-mono">
                                                    MAJ: {new Date(analysis.timestamp).toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric' })} à {new Date(analysis.timestamp).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                                                </span>
                                            </div>

                                            {analysis.flash.content && (
                                                <div className="p-4 bg-[#0d1526] rounded border border-[#1a1f2e]">
                                                    <p className="text-sm text-[#e0e0e0] leading-relaxed">
                                                        {analysis.flash.content}
                                                    </p>
                                                </div>
                                            )}

                                            {analysis.flash.points && analysis.flash.points.length > 0 && (
                                                <ul className="space-y-4">
                                                    {analysis.flash.points.map((point: string, i: number) => (
                                                        <li key={i} className="flex gap-3 text-sm border-l-2 border-[#00d4ff] pl-4 py-1 bg-gradient-to-r from-[#00d4ff05] to-transparent">
                                                            <span className="opacity-80">{point}</span>
                                                        </li>
                                                    ))}
                                                </ul>
                                            )}

                                            {analysis.flash.tendance_label && (
                                                <div className="p-4 bg-[#0d1526] rounded border border-[#1a1f2e] mt-auto">
                                                    <p className="text-xs text-[#8892a0] italic">
                                                        "{analysis.flash.tendance_label}"
                                                    </p>
                                                </div>
                                            )}
                                        </div>
                                    )}

                                    {activeTab === 'report' && analysis.report && (
                                        <div className="space-y-6 animate-in fade-in duration-500">
                                            <div className="grid grid-cols-3 gap-3">
                                                {[
                                                    { l: 'Tension', v: analysis.report.tension || analysis.report.indicateurs?.tension_geopolitique || 0, c: '#ff3b3b' },
                                                    { l: 'Volatilité', v: analysis.report.volatility || analysis.report.indicateurs?.volatilite_petrole || 0, c: '#00d4ff' },
                                                    { l: 'Risque', v: analysis.report.risk || analysis.report.indicateurs?.risque_sanctions || 0, c: '#ff6b35' }
                                                ].map((idx) => (
                                                    <div key={idx.l} className="p-4 bg-[#0a0e17] border border-[#1a1f2e] rounded text-center hover:border-white/10 transition-colors">
                                                        <span className="block text-[8px] text-[#8892a0] uppercase mb-2 font-bold">{idx.l}</span>
                                                        <span className="text-2xl font-black" style={{ color: idx.c }}>{idx.v}/10</span>
                                                    </div>
                                                ))}
                                            </div>

                                            {analysis.report.content && (
                                                <div className="p-5 bg-white/5 rounded-xl border border-white/5">
                                                    <p className="text-sm leading-relaxed text-[#c0c8d6] whitespace-pre-wrap">
                                                        {analysis.report.content}
                                                    </p>
                                                </div>
                                            )}

                                            {analysis.report.geopolitique && (
                                                <section>
                                                    <h4 className="text-[10px] font-bold uppercase text-[#00ff88] mb-2 tracking-widest flex items-center gap-2">
                                                        Analyse Géopolitique
                                                    </h4>
                                                    <p className="text-xs leading-relaxed text-[#8892a0]">
                                                        {analysis.report.geopolitique}
                                                    </p>
                                                </section>
                                            )}

                                            {analysis.report.economie_petrole && (
                                                <section>
                                                    <h4 className="text-[10px] font-bold uppercase text-[#00ff88] mb-2 tracking-widest flex items-center gap-2">
                                                        Économie & Pétrole
                                                    </h4>
                                                    <p className="text-xs leading-relaxed text-[#8892a0]">
                                                        {analysis.report.economie_petrole}
                                                    </p>
                                                </section>
                                            )}
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
                                <button
                                    onClick={handleExportPDF}
                                    disabled={isGeneratingPDF}
                                    className={`flex items-center gap-2 px-4 py-2 rounded border transition-all ${isGeneratingPDF
                                            ? 'bg-[#1a1f2e] border-[#00d4ff]/20 text-[#00d4ff]/50 cursor-wait'
                                            : 'bg-[#00d4ff]/10 border-[#00d4ff]/40 text-[#00d4ff] hover:bg-[#00d4ff]/20 hover:border-[#00d4ff] hover:text-white cursor-pointer'
                                        }`}
                                >
                                    {isGeneratingPDF ? (
                                        <>
                                            <Cpu className="w-4 h-4 animate-spin" />
                                            <span className="font-bold">GÉNÉRATION EN COURS...</span>
                                        </>
                                    ) : (
                                        <>
                                            <FileDown className="w-4 h-4" />
                                            <span className="font-bold">EXPORTER PDF</span>
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* RIGHT COLUMN - MISC INFO */}
                <div className="lg:col-span-3 flex flex-col gap-6">

                    {/* PDVSA DATA / OPEP */}
                    <div className="glass-card p-4">
                        <h2 className="text-xs uppercase font-bold tracking-widest font-mono mb-2 flex items-center gap-2">
                            <TrendingUp className="w-4 h-4 text-[#00d4ff]" /> Destinations Exportations PDVSA
                        </h2>
                        <p className="text-[9px] text-[#8892a0] mb-4">Répartition par pays (% du volume total)</p>

                        <div className="h-[220px] mb-4 px-2">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={PDVSA_EXPORTS}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={55}
                                        outerRadius={70}
                                        paddingAngle={3}
                                        dataKey="value"
                                        label={({ cx, cy, midAngle, outerRadius, value }) => {
                                            const RADIAN = Math.PI / 180;
                                            const radius = outerRadius + 25;
                                            const x = cx + radius * Math.cos(-midAngle * RADIAN);
                                            const y = cy + radius * Math.sin(-midAngle * RADIAN);
                                            return (
                                                <text x={x} y={y} fill="#fff" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central" fontSize="14" fontWeight="bold">
                                                    {value}%
                                                </text>
                                            );
                                        }}
                                        labelLine={false}
                                    >
                                        {PDVSA_EXPORTS.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.color} />
                                        ))}
                                    </Pie>
                                    <Tooltip
                                        contentStyle={{ backgroundColor: '#0d1526', border: '1px solid #00d4ff', borderRadius: '6px', fontSize: '11px', padding: '8px' }}
                                        itemStyle={{ color: '#fff', fontWeight: 'bold' }}
                                        formatter={(value: any, name: string, entry: any) => [`${value}% du total`, entry.payload.name]}
                                    />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>

                        {/* Légende manuelle */}
                        <div className="space-y-2 mb-4 pb-4 border-b border-[#1a1f2e]">
                            {PDVSA_EXPORTS.map((dest) => (
                                <div key={dest.name} className="flex items-center justify-between text-xs">
                                    <div className="flex items-center gap-2">
                                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: dest.color }} />
                                        <span className="text-[#e8e8e8]">{dest.name}</span>
                                    </div>
                                    <span className="font-mono text-[#8892a0]">{dest.value}%</span>
                                </div>
                            ))}
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
                                <span className="font-mono text-[#00d4ff]">12/02/2026</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* TIMELINE - FULL WIDTH BOTTOM ROW - REAL AI DATA */}
                <div className="lg:col-span-12 glass-card flex flex-col overflow-visible">
                    <div className="p-4 border-b border-[#1a1f2e] flex items-center justify-between">
                        <h2 className="text-xs uppercase font-bold tracking-widest font-mono flex items-center gap-2">
                            <Clock className="w-4 h-4 text-[#8892a0]" /> TIMELINE ÉVÉNEMENTS
                        </h2>
                        <div className="flex gap-2">
                            <button
                                onClick={() => scrollTimeline('left')}
                                className="w-8 h-8 bg-[#1a1f2e] hover:bg-[#00d4ff]/20 border border-[#00d4ff]/30 rounded flex items-center justify-center transition-all group"
                                title="Défiler à gauche"
                            >
                                <ChevronRight className="w-4 h-4 text-[#00d4ff] rotate-180 group-hover:scale-110 transition-transform" />
                            </button>
                            <button
                                onClick={() => scrollTimeline('right')}
                                className="w-8 h-8 bg-[#1a1f2e] hover:bg-[#00d4ff]/20 border border-[#00d4ff]/30 rounded flex items-center justify-center transition-all group"
                                title="Défiler à droite"
                            >
                                <ChevronRight className="w-4 h-4 text-[#00d4ff] group-hover:scale-110 transition-transform" />
                            </button>
                        </div>
                    </div>
                    <div ref={timelineRef} className="flex-1 overflow-x-auto p-4 pt-40 pb-8 custom-scrollbar">
                        <div className="flex gap-4 pb-4 min-w-max relative">
                            {/* Ligne horizontale de connexion */}
                            <div className="absolute top-8 left-0 right-0 h-px bg-[#1a1f2e]"></div>

                            {(analysis?.report?.timeline || [
                                { date: '2026-01-02T23:00:00Z', icon: '🔥', title: 'Jour J - Opération Absolute Resolve', description: 'Coup d\'envoi de l\'opération militaire "Absolute Resolve" dans la nuit du 2 au 3 janvier 2026' },
                                { date: new Date().toISOString(), icon: '📢', title: 'Analyse en cours', description: 'Dernière mise à jour de l\'analyse géopolitique' }
                            ]).map((ev: any, i: number) => {
                                const eventDate = new Date(ev.date);
                                const formattedDate = eventDate.toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric' });
                                const formattedTime = eventDate.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });

                                return (
                                    <div key={i} className="relative group min-w-[200px] cursor-pointer">
                                        {/* Dot connector */}
                                        <div className="absolute top-7 left-1/2 -translate-x-1/2 w-3 h-3 rounded-full bg-[#00d4ff] border-2 border-[#0d1526] z-10 group-hover:scale-125 transition-transform" />

                                        {/* Event card */}
                                        <div className="mt-12 p-3 bg-[#0d1526] border border-[#1a1f2e] rounded-lg group-hover:border-[#00d4ff4d] group-hover:shadow-lg group-hover:shadow-[#00d4ff]/20 transition-all">
                                            <div className="text-center mb-2">
                                                <span className="text-2xl">{ev.icon}</span>
                                            </div>
                                            <h4 className="text-xs font-semibold text-center mb-2 line-clamp-2">
                                                {ev.title}
                                            </h4>
                                            <div className="text-[9px] text-center text-[#8892a0] font-mono">
                                                <div>{formattedDate}</div>
                                                <div className="text-[#00d4ff]">{formattedTime}</div>
                                            </div>

                                            {/* Hover tooltip - EXTRA LARGE */}
                                            <div className="hidden group-hover:block absolute bottom-full left-1/2 -translate-x-1/2 mb-4 w-72 p-4 bg-[#0d1526] border-2 border-[#00d4ff] rounded-lg text-xs text-[#e8e8e8] z-50 shadow-2xl pointer-events-none">
                                                <div className="font-bold text-[#00d4ff] mb-2">{ev.title}</div>
                                                <div className="leading-relaxed">{ev.description}</div>
                                                {/* Arrow */}
                                                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-full w-0 h-0 border-l-8 border-r-8 border-t-8 border-l-transparent border-r-transparent border-t-[#00d4ff]"></div>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>

            </main>

            {/* SOCIAL MEDIA SECTION */}
            <div className="px-4 md:px-6 max-w-[1600px] mx-auto w-full mb-6">
                <SocialMediaFeed />
            </div>

            {/* YOUTUBE VIDEOS SECTION */}
            <div className="px-4 md:px-6 max-w-[1600px] mx-auto w-full mb-6">
                <YouTubeVideos />
            </div>

            {/* NEWS MODAL */}
            {selectedNews && (
                <div
                    className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                    onClick={() => setSelectedNews(null)}
                >
                    <div
                        className="glass-card max-w-2xl w-full p-6 max-h-[80vh] overflow-y-auto"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="flex items-start justify-between mb-4">
                            <div className="flex-1">
                                <div className="text-[10px] text-[#00d4ff] font-mono mb-2">
                                    {selectedNews.source_name || selectedNews.source} • {new Date(selectedNews.published_at).toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric' })} à {new Date(selectedNews.published_at).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                                </div>
                                <h3 className="text-xl font-bold mb-4">{selectedNews.title_fr || selectedNews.title}</h3>
                            </div>
                            <button
                                onClick={() => setSelectedNews(null)}
                                className="ml-4 text-[#8892a0] hover:text-white transition-colors"
                            >
                                ✕
                            </button>
                        </div>

                        <div className="space-y-4">
                            {selectedNews.description && (
                                <div className="p-4 bg-[#0d1526] rounded-lg border border-[#1a1f2e]">
                                    <p className="text-sm text-[#c0c8d6] leading-relaxed">
                                        {selectedNews.description}
                                    </p>
                                </div>
                            )}

                            {!selectedNews.description && (
                                <div className="p-4 bg-[#0d1526] rounded-lg border border-[#1a1f2e] text-center">
                                    <p className="text-sm text-[#8892a0] italic">
                                        Résumé non disponible pour cet article
                                    </p>
                                </div>
                            )}

                            <div className="flex gap-3">
                                <button
                                    onClick={() => setSelectedNews(null)}
                                    className="flex-1 px-4 py-2 bg-[#1a1f2e] hover:bg-[#2a2f3e] border border-[#00d4ff4d] rounded text-sm font-mono transition-colors"
                                >
                                    FERMER
                                </button>
                                {/* Google Search URL for the fallback button in modal too */}
                                <button
                                    onClick={() => window.open(`https://www.google.com/search?q=${encodeURIComponent(selectedNews.title_fr || selectedNews.title)}`, '_blank')}
                                    className="flex-1 px-4 py-2 bg-[#00d4ff] hover:bg-[#00b8d4] text-[#0a0e17] rounded text-sm font-mono font-bold transition-colors flex items-center justify-center gap-2"
                                >
                                    <ExternalLink className="w-4 h-4" />
                                    RECHERCHER SUR GOOGLE
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}


            {/* FOOTER / STATUS BAR */}
            <footer className="h-10 border-t border-[#1a1f2e] bg-[#0d1526] px-6 flex items-center justify-between text-[10px] font-mono text-[#4a5568]">
                <div className="flex gap-6">
                    <span className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-green-500"></span> API: CONNECTED</span>
                    <span className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-green-500"></span> DB: SYNC</span>
                    <span className="hidden md:inline text-[#8892a0]">
                        DERNIÈRE MAJ: {lastUpdate.toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric' })} à {lastUpdate.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                    </span>
                    <button
                        onClick={refreshData}
                        className="text-[#00d4ff] hover:text-[#00ff88] transition-colors underline cursor-pointer"
                        title="Rafraîchir les données"
                    >
                        RAFRAÎCHIR ↻
                    </button>
                </div>
                <div className="flex gap-4">
                    <span className="text-[#8892a0]">V1.1.0-ULTRA</span>
                    <span className="text-[#00d4ff]">© 2026 VENEZUELA WATCH</span>
                </div>
            </footer>

            <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
          height: 4px; /* Added height for horizontal scrollbar */
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
