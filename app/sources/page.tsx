"use client";

import React, { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
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
    Clock,
    ShieldCheck
} from "lucide-react";
import Link from "next/link";

export default function SourcesPage() {
    const [searchTerm, setSearchTerm] = useState("");
    const [sources, setSources] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchSources();
    }, []);

    const fetchSources = async () => {
        setLoading(true);
        try {
            const { data, error } = await supabase
                .from('sources')
                .select('*')
                .order('reliability_score', { ascending: false });

            if (data) setSources(data);
            if (error) console.error("Error fetching sources:", error);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const getStatusIcon = (isActive: boolean) => {
        return isActive
            ? <CheckCircle2 className="w-3 h-3 text-[#00ff88]" />
            : <AlertCircle className="w-3 h-3 text-[rgb(255,59,59)]" />;
    };

    const getStatusClass = (isActive: boolean) => {
        return isActive
            ? "bg-[#00ff88]/10 text-[#00ff88] border-[#00ff88]/20"
            : "bg-[#ff3b3b]/10 text-[#ff3b3b] border-[#ff3b3b]/20";
    };

    // Determine type based on URL or category logic
    const getTypeIcon = (category: string) => {
        if (category === 'Oil' || category === 'Economy') return <Database className="w-3 h-3" />;
        if (category === 'API') return <Cpu className="w-3 h-3" />;
        return <Rss className="w-3 h-3" />;
    };

    const filteredSources = sources.filter(s =>
        s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.category?.toLowerCase().includes(searchTerm.toLowerCase())
    );

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
                    <Link href="/transparency" className="flex items-center gap-1.5 px-3 py-1 bg-[#1a1f2e] border border-[#1a1f2e] hover:border-[#00ff88]/50 rounded text-[10px] font-mono text-[#8892a0] transition-all hover:text-[#00ff88]">
                        <ShieldCheck className="w-3 h-3" /> MÉTHODOLOGIE & IA
                    </Link>
                    <button onClick={fetchSources} className="flex items-center gap-1.5 px-3 py-1 bg-[#1a1f2e] border border-[#1a1f2e] hover:border-[#00d4ff]/50 rounded text-[10px] font-mono text-[#8892a0] transition-all">
                        <RefreshCcw className={`w-3 h-3 ${loading ? 'animate-spin' : ''}`} /> RAFRAÎCHIR
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
                </div>

                {/* SOURCES TABLE */}
                <div className="glass-card overflow-hidden min-h-[400px]">
                    <div className="overflow-x-auto">
                        <table className="w-full border-collapse">
                            <thead>
                                <tr className="bg-[#1a1f2e]/50 text-left border-b border-[#1a1f2e]">
                                    <th className="px-6 py-4 text-[10px] font-mono font-bold uppercase tracking-widest text-[#8892a0]">Source</th>
                                    <th className="px-6 py-4 text-[10px] font-mono font-bold uppercase tracking-widest text-[#8892a0]">Catégorie</th>
                                    <th className="px-6 py-4 text-[10px] font-mono font-bold uppercase tracking-widest text-[#8892a0]">Langue</th>
                                    <th className="px-6 py-4 text-[10px] font-mono font-bold uppercase tracking-widest text-[#8892a0]">Fiabilité (1-10)</th>
                                    <th className="px-6 py-4 text-[10px] font-mono font-bold uppercase tracking-widest text-[#8892a0]">Statut</th>
                                    <th className="px-6 py-4 text-[10px] font-mono font-bold uppercase tracking-widest text-[#8892a0]">Dernier Scan</th>
                                    <th className="px-6 py-4 text-[10px] font-mono font-bold uppercase tracking-widest text-[#8892a0]">Lien</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-[#1a1f2e]">
                                {loading ? (
                                    <tr>
                                        <td colSpan={7} className="px-6 py-12 text-center text-[#8892a0] animate-pulse font-mono">
                                            CHARGEMENT DE LA BASE DE DONNÉES...
                                        </td>
                                    </tr>
                                ) : filteredSources.length === 0 ? (
                                    <tr>
                                        <td colSpan={7} className="px-6 py-12 text-center text-[#8892a0] font-mono">
                                            AUCUNE SOURCE TROUVÉE. VEUILLEZ EXÉCUTER LE SCRIPT DE REMPLISSAGE (SEED).
                                        </td>
                                    </tr>
                                ) : (
                                    filteredSources.map((source) => (
                                        <tr key={source.id} className="hover:bg-[#1a1f2e]/30 transition-colors group">
                                            <td className="px-6 py-4">
                                                <div className="font-medium text-sm text-[#e8e8e8] group-hover:text-[#00d4ff] transition-colors">{source.name}</div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-2 text-[10px] font-mono text-[#8892a0]">
                                                    {getTypeIcon(source.category)}
                                                    <span>{source.category}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="text-[10px] px-1.5 py-0.5 bg-[#0a0e17] rounded border border-white/5 font-mono uppercase">
                                                    {source.language}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex gap-0.5">
                                                    {[...Array(10)].map((_, i) => (
                                                        <div key={i} className={`w-1 h-2 rounded-sm ${i < source.reliability_score ? 'bg-yellow-500' : 'bg-[#1a1f2e]'}`} />
                                                    ))}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full border text-[9px] font-bold uppercase ${getStatusClass(source.is_active)}`}>
                                                    {getStatusIcon(source.is_active)}
                                                    <span>{source.is_active ? 'ACTIF' : 'INACTIF'}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="text-[10px] font-mono text-[#8892a0]">
                                                    {source.last_fetched_at ? new Date(source.last_fetched_at).toLocaleDateString() : '-'}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <a href={source.url} target="_blank" className="p-1.5 hover:bg-[#00d4ff]/10 rounded transition-colors text-[#4a5568] hover:text-[#00d4ff]">
                                                    <ExternalLink className="w-3.5 h-3.5" />
                                                </a>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* BOTTOM METRICS */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
                    {[
                        { label: 'Total Sources', val: sources.length || 0 },
                        { label: 'Actives', val: sources.filter(s => s.is_active).length || 0, color: 'text-[#00ff88]' },
                        { label: 'Haute Fiabilité (>8)', val: sources.filter(s => s.reliability_score > 8).length || 0, color: 'text-[#00d4ff]' },
                        { label: 'Sources FR', val: sources.filter(s => s.language === 'fr').length || 0, color: 'text-indigo-400' }
                    ].map((m) => (
                        <div key={m.label} className="p-4 bg-[#0d1526]/50 border border-[#1a1f2e] rounded">
                            <span className="block text-[8px] text-[#4a5568] uppercase font-mono tracking-widest mb-1">{m.label}</span>
                            <span className={`text-xl font-bold font-mono ${m.color || 'text-[#e8e8e8]'}`}>{m.val}</span>
                        </div>
                    ))}
                </div>
            </main>
        </div>
    );
}
