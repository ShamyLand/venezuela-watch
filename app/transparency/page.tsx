"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, ShieldCheck, Cpu, Scale, BookOpen, AlertCircle, RefreshCcw } from "lucide-react";
import { supabase } from "@/lib/supabase";

export default function TransparencyPage() {
    const [analysis, setAnalysis] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchLatestMethodology();
    }, []);

    const fetchLatestMethodology = async () => {
        setLoading(true);
        try {
            const { data, error } = await supabase
                .from('analyses')
                .select('transparency_json, report_json, timestamp')
                .order('timestamp', { ascending: false })
                .limit(1)
                .single();

            if (data) {
                setAnalysis({
                    ...data.transparency_json,
                    report: data.report_json,
                    timestamp: data.timestamp
                });
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col min-h-screen bg-[#0a0e17] text-[#e8e8e8] selection:bg-[#00d4ff] selection:text-[#0a0e17]">
            {/* Header */}
            <header className="h-16 border-b border-[#1a1f2e] bg-[#0d1526]/80 backdrop-blur-md px-6 flex items-center justify-between sticky top-0 z-50">
                <div className="flex items-center gap-4">
                    <Link href="/" className="p-2 hover:bg-[#1a1f2e] rounded transition-colors text-[#8892a0] hover:text-[#00d4ff]">
                        <ArrowLeft className="w-5 h-5" />
                    </Link>
                    <div className="flex items-center gap-3">
                        <ShieldCheck className="w-5 h-5 text-[#00ff88]" />
                        <h1 className="text-sm font-bold tracking-widest uppercase font-mono">
                            Transparence & Méthodologie IA
                        </h1>
                    </div>
                </div>
                <div>
                    <button onClick={fetchLatestMethodology} className="flex items-center gap-2 px-3 py-1.5 bg-[#1a1f2e] border border-[#1a1f2e] hover:border-[#00d4ff]/50 rounded text-[10px] font-mono text-[#8892a0] hover:text-[#00d4ff] transition-all">
                        <RefreshCcw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
                        <span className="hidden md:inline">ACTUALISER</span>
                    </button>
                </div>
            </header>

            <main className="flex-1 p-6 max-w-[1000px] mx-auto w-full space-y-12">

                {/* Intro Section */}
                <section className="space-y-4">
                    <h2 className="text-2xl font-black uppercase text-white tracking-tight flex items-center gap-3">
                        <Cpu className="w-6 h-6 text-[#00d4ff]" />
                        Méthodologie Dynamique
                    </h2>
                    <p className="text-[#8892a0] leading-relaxed text-sm md:text-base border-l-2 border-[#00d4ff] pl-4">
                        Ci-dessous, l'Intelligence Artificielle explique <strong>pourquoi</strong> elle a attribué les scores actuels.
                        Cette section est générée automatiquement à chaque nouvelle analyse pour garantir une transparence totale sur le raisonnement algorithmique.
                    </p>
                    {analysis?.timestamp && (
                        <p className="text-[10px] font-mono text-[#00ff88] mt-2">
                            DERNIÈRE ANALYSE : {new Date(analysis.timestamp).toLocaleString('fr-FR')}
                        </p>
                    )}
                </section>

                {/* DYNAMIC AI REASONING */}
                {analysis?.methodology && (
                    <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* TENSION REASONING */}
                        <div className="glass-card p-6 border-t-4 border-t-[#ff3b3b] relative overflow-hidden">
                            <div className="absolute top-2 right-2 text-[10px] font-bold text-[#ff3b3b]/50 uppercase tracking-widest">Tension</div>
                            <h3 className="font-bold text-lg text-white mb-4">Justification du Score Tension</h3>
                            <p className="text-sm text-[#c0c8d6] leading-relaxed italic">
                                "{analysis.methodology.tension_scoring || "Pas d'explication fournie."}"
                            </p>
                            <div className="mt-4 pt-4 border-t border-white/5 flex justify-between items-center">
                                <span className="text-[10px] text-[#8892a0]">SCORE ACTUEL</span>
                                <span className="text-xl font-black text-[#ff3b3b]">{analysis.report?.tension || '?'}</span>
                            </div>
                        </div>

                        {/* RISK REASONING */}
                        <div className="glass-card p-6 border-t-4 border-t-[#ff6b35] relative overflow-hidden">
                            <div className="absolute top-2 right-2 text-[10px] font-bold text-[#ff6b35]/50 uppercase tracking-widest">Risque</div>
                            <h3 className="font-bold text-lg text-white mb-4">Justification du Score Risque</h3>
                            <p className="text-sm text-[#c0c8d6] leading-relaxed italic">
                                "{analysis.methodology.risk_scoring || "Pas d'explication fournie."}"
                            </p>
                            <div className="mt-4 pt-4 border-t border-white/5 flex justify-between items-center">
                                <span className="text-[10px] text-[#8892a0]">SCORE ACTUEL</span>
                                <span className="text-xl font-black text-[#ff6b35]">{analysis.report?.risk || '?'}</span>
                            </div>
                        </div>
                    </section>
                )}

                {/* AI GLOBAL REASONING */}
                {analysis?.ai_reasoning && (
                    <section className="glass-card p-6 border border-[#00d4ff]/20 bg-[#00d4ff]/5">
                        <h3 className="font-bold text-[#00d4ff] mb-2 uppercase text-xs tracking-widest flex items-center gap-2">
                            <Cpu className="w-4 h-4" /> Raisonnement Global de l'IA
                        </h3>
                        <p className="text-sm text-[#e8e8e8] leading-relaxed font-mono">
                            "{analysis.ai_reasoning}"
                        </p>
                    </section>
                )}

                {/* STATIC SCALE (BARÈME) */}
                <section className="space-y-6 pt-12 border-t border-[#1a1f2e]">
                    <h3 className="text-xl font-bold uppercase text-white tracking-widest flex items-center gap-2 font-mono">
                        <Scale className="w-5 h-5 text-[#8892a0]" />
                        Référence : Le Barème Standard
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {/* Low Risk */}
                        <div className="p-6 bg-[#0d1526] border border-[#1a1f2e] rounded-lg relative group hover:border-[#00ff88]/50 transition-colors">
                            <h4 className="text-[#00ff88] font-bold text-lg mb-2">1.0 - 3.9</h4>
                            <span className="text-xs font-mono bg-[#00ff88]/10 text-[#00ff88] px-2 py-1 rounded inline-block mb-4">SITUATION STABLE</span>
                            <ul className="text-xs text-[#8892a0] space-y-2 list-disc pl-4">
                                <li>Calme civil, pas de conflit.</li>
                                <li>Indicateurs éco stables.</li>
                            </ul>
                        </div>

                        {/* Medium Risk */}
                        <div className="p-6 bg-[#0d1526] border border-[#1a1f2e] rounded-lg relative group hover:border-yellow-500/50 transition-colors">
                            <h4 className="text-yellow-500 font-bold text-lg mb-2">4.0 - 6.9</h4>
                            <span className="text-xs font-mono bg-yellow-500/10 text-yellow-500 px-2 py-1 rounded inline-block mb-4">TENSION ÉLEVÉE</span>
                            <ul className="text-xs text-[#8892a0] space-y-2 list-disc pl-4">
                                <li>Manifestations, Sanctions.</li>
                                <li>Rétorique politique aggressive.</li>
                            </ul>
                        </div>

                        {/* Critical Risk */}
                        <div className="p-6 bg-[#0d1526] border border-[#1a1f2e] rounded-lg relative group hover:border-[#ff3b3b]/50 transition-colors">
                            <h4 className="text-[#ff3b3b] font-bold text-lg mb-2">7.0 - 10.0</h4>
                            <span className="text-xs font-mono bg-[#ff3b3b]/10 text-[#ff3b3b] px-2 py-1 rounded inline-block mb-4">CRISE / CONFLIT</span>
                            <ul className="text-xs text-[#8892a0] space-y-2 list-disc pl-4">
                                <li>Affrontements, Rupture diplomatique.</li>
                                <li>Effondrement éco, Arrêt pétrole.</li>
                            </ul>
                        </div>
                    </div>
                </section>
            </main>
        </div>
    );
}
