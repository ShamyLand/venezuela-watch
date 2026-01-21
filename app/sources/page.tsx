"use client";

import React, { useState } from "react";
import {
    ArrowLeft,
    Search,
    Filter,
    ExternalLink,
    Star,
    Globe,
    Database,
    Rss,
    Cpu,
    RefreshCcw,
    CheckCircle2,
    AlertCircle,
    Clock
} from "lucide-react";
import Link from "next/link";

const SOURCES_DATA = [
    { id: 1, name: "Reuters", type: "API", lang: "EN", reliability: 5, status: "Active", last: "2m ago", url: "reuters.com" },
    { id: 2, name: "Bloomberg", type: "API", lang: "EN", reliability: 5, status: "Active", last: "5m ago", url: "bloomberg.com" },
    { id: 3, name: "El Nacional", type: "RSS", lang: "ES", reliability: 4, status: "Active", last: "15m ago", url: "elnacional.com" },
    { id: 4, name: "OilPrice.com", type: "Scraping", lang: "EN", reliability: 4, status: "Active", last: "12m ago", url: "oilprice.com" },
    { id: 5, name: "Le Monde", type: "RSS", lang: "FR", reliability: 5, status: "Active", last: "45m ago", url: "lemonde.fr" },
    { id: 6, name: "PDVSA Official", type: "Scraping", lang: "ES", reliability: 3, status: "Slow", last: "2h ago", url: "pdvsa.com" },
    { id: 7, name: "OPEC Secretariat", type: "API", lang: "EN", reliability: 5, status: "Active", last: "1h ago", url: "opec.org" },
    { id: 8, name: "Efecto Cocuyo", type: "RSS", lang: "ES", reliability: 4, status: "Error", last: "6h ago", url: "efectococuyo.com" },
    { id: 9, name: "France 24", type: "RSS", lang: "FR", reliability: 5, status: "Active", last: "22m ago", url: "france24.com" },
    { id: 10, name: "Tal Cual", type: "RSS", lang: "ES", reliability: 4, status: "Active", last: "18m ago", url: "talcualdigital.com" },
];

export default function SourcesPage() {
    const [searchTerm, setSearchTerm] = useState("");

    const getStatusIcon = (status: string) => {
        switch (status) {
            case "Active": return <CheckCircle2 className="w-3 h-3 text-[#00ff88]" />;
            case "Slow": return <Clock className="w-3 h-3 text-yellow-500" />;
            case "Error": return <AlertCircle className="w-3 h-3 text-[#ff3b3b]" />;
            default: return null;
        }
    };

    const getStatusClass = (status: string) => {
        switch (status) {
            case "Active": return "bg-[#00ff88]/10 text-[#00ff88] border-[#00ff88]/20";
            case "Slow": return "bg-yellow-500/10 text-yellow-500 border-yellow-500/20";
            case "Error": return "bg-[#ff3b3b]/10 text-[#ff3b3b] border-[#ff3b3b]/20";
            default: return "";
        }
    };

    const getTypeIcon = (type: string) => {
        switch (type) {
            case "API": return <Cpu className="w-3 h-3" />;
            case "RSS": return <Rss className="w-3 h-3" />;
            case "Scraping": return <Database className="w-3 h-3" />;
            default: return null;
        }
    };

    return (
        <div className="flex flex-col min-h-screen bg-[#0a0e17] text-[#e8e8e8]">
            {/* Mini Header */}
            <header className="h-14 border-b border-[#1a1f2e] bg-[#0d1526]/80 backdrop-blur-md px-6 flex items-center justify-between sticky top-0 z-50">
                <div className="flex items-center gap-4">
                    <Link href="/" className="p-1.5 hover:bg-[#1a1f2e] rounded transition-colors text-[#8892a0] hover:text-[#00d4ff]">
                        <ArrowLeft className="w-4 h-4" />
                    </Link>
                    <div className="flex items-center gap-2">
                        <Database className="w-4 h-4 text-[#00d4ff]" />
                        <h1 className="text-sm font-bold tracking-widest uppercase font-mono">Index des Sources de Données</h1>
                    </div>
                </div>
                <div className="flex items-center gap-4">
                    <button className="flex items-center gap-1.5 px-3 py-1 bg-[#1a1f2e] border border-[#1a1f2e] hover:border-[#00d4ff]/50 rounded text-[10px] font-mono text-[#8892a0] transition-all">
                        <RefreshCcw className="w-3 h-3" /> RAFRAÎCHIR
                    </button>
                </div>
            </header>

            <main className="flex-1 p-6 max-w-[1200px] mx-auto w-full">
                {/* FILTERS BAR */}
                <div className="flex flex-col md:flex-row gap-4 mb-8">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#4a5568]" />
                        <input
                            type="text"
                            placeholder="Rechercher une source (Reuters, Bloomberg...)"
                            className="w-full bg-[#0d1526] border border-[#1a1f2e] focus:border-[#00d4ff]/50 rounded pl-10 pr-4 py-2 text-sm outline-none transition-all placeholder:text-[#4a5568]"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <div className="flex gap-2">
                        <button className="flex items-center gap-2 px-4 py-2 bg-[#0d1526] border border-[#1a1f2e] rounded text-xs font-mono text-[#8892a0] hover:text-[#00d4ff] transition-colors">
                            <Filter className="w-3 h-3" /> TYPE: TOUS
                        </button>
                        <button className="flex items-center gap-2 px-4 py-2 bg-[#0d1526] border border-[#1a1f2e] rounded text-xs font-mono text-[#8892a0] hover:text-[#00d4ff] transition-colors">
                            <Globe className="w-3 h-3" /> LANGUE: TOUTES
                        </button>
                    </div>
                </div>

                {/* SOURCES TABLE */}
                <div className="glass-card overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full border-collapse">
                            <thead>
                                <tr className="bg-[#1a1f2e]/50 text-left border-b border-[#1a1f2e]">
                                    <th className="px-6 py-4 text-[10px] font-mono font-bold uppercase tracking-widest text-[#8892a0]">Source</th>
                                    <th className="px-6 py-4 text-[10px] font-mono font-bold uppercase tracking-widest text-[#8892a0]">Type</th>
                                    <th className="px-6 py-4 text-[10px] font-mono font-bold uppercase tracking-widest text-[#8892a0]">Langue</th>
                                    <th className="px-6 py-4 text-[10px] font-mono font-bold uppercase tracking-widest text-[#8892a0]">Fiabilité</th>
                                    <th className="px-6 py-4 text-[10px] font-mono font-bold uppercase tracking-widest text-[#8892a0]">Statut</th>
                                    <th className="px-6 py-4 text-[10px] font-mono font-bold uppercase tracking-widest text-[#8892a0]">Collecte</th>
                                    <th className="px-6 py-4 text-[10px] font-mono font-bold uppercase tracking-widest text-[#8892a0]">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-[#1a1f2e]">
                                {SOURCES_DATA.filter(s => s.name.toLowerCase().includes(searchTerm.toLowerCase())).map((source) => (
                                    <tr key={source.id} className="hover:bg-[#1a1f2e]/30 transition-colors group">
                                        <td className="px-6 py-4">
                                            <div className="font-medium text-sm text-[#e8e8e8] group-hover:text-[#00d4ff] transition-colors">{source.name}</div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2 text-[10px] font-mono text-[#8892a0]">
                                                {getTypeIcon(source.type)}
                                                <span>{source.type}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="text-[10px] px-1.5 py-0.5 bg-[#0a0e17] rounded border border-white/5 font-mono">
                                                {source.lang === 'EN' && '🇺🇸 EN'}
                                                {source.lang === 'ES' && '🇪🇸 ES'}
                                                {source.lang === 'FR' && '🇫🇷 FR'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex gap-0.5">
                                                {[...Array(5)].map((_, i) => (
                                                    <Star key={i} className={`w-3 h-3 ${i < source.reliability ? 'text-yellow-500 fill-yellow-500' : 'text-[#1a1f2e]'}`} />
                                                ))}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full border text-[9px] font-bold uppercase ${getStatusClass(source.status)}`}>
                                                {getStatusIcon(source.status)}
                                                <span>{source.status}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="text-[10px] font-mono text-[#8892a0]">{source.last}</div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <a href={`https://${source.url}`} target="_blank" className="p-1.5 hover:bg-[#00d4ff]/10 rounded transition-colors text-[#4a5568] hover:text-[#00d4ff]">
                                                <ExternalLink className="w-3.5 h-3.5" />
                                            </a>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* BOTTOM METRICS */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
                    {[
                        { label: 'Total Sources', val: '42' },
                        { label: 'Actives', val: '38', color: 'text-[#00ff88]' },
                        { label: 'Erreurs', val: '1', color: 'text-[#ff3b3b]' },
                        { label: 'Sync Rate', val: '98.5%', color: 'text-[#00d4ff]' }
                    ].map((m) => (
                        <div key={m.label} className="p-4 bg-[#0d1526]/50 border border-[#1a1f2e] rounded">
                            <span className="block text-[8px] text-[#4a5568] uppercase font-mono tracking-widest mb-1">{m.label}</span>
                            <span className={`text-xl font-bold font-mono ${m.color || 'text-[#e8e8e8]'}`}>{m.val}</span>
                        </div>
                    ))}
                </div>
            </main>

            {/* FOOTER */}
            <footer className="h-10 border-t border-[#1a1f2e] bg-[#0d1526] px-6 flex items-center justify-between text-[10px] font-mono text-[#404b5a]">
                <div>LAST SYSTEM SCAN: TODAY 18:30 UTC</div>
                <div className="text-[#00d4ff] animate-pulse">SYSTEM STATUS: OPTIMAL</div>
            </footer>
        </div>
    );
}
