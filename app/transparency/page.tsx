"use client";

import React from "react";
import Link from "next/link";
import { ArrowLeft, ShieldCheck, Cpu, Scale, BookOpen, AlertCircle, CheckCircle2 } from "lucide-react";

export default function TransparencyPage() {
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
            </header>

            <main className="flex-1 p-6 max-w-[1000px] mx-auto w-full space-y-12">

                {/* Intro Section */}
                <section className="space-y-4">
                    <h2 className="text-2xl font-black uppercase text-white tracking-tight flex items-center gap-3">
                        <Cpu className="w-6 h-6 text-[#00d4ff]" />
                        Comment fonctionne notre Intelligence Artificielle ?
                    </h2>
                    <p className="text-[#8892a0] leading-relaxed text-sm md:text-base border-l-2 border-[#00d4ff] pl-4">
                        Ce tableau de bord utilise le modèle <strong>Google Gemini 1.5 Flash</strong> pour analyser en temps réel plus de 100 sources d'informations.
                        Notre approche privilégie une transparence totale : chaque score, chaque alerte et chaque analyse est générée selon un barème strict
                        que nous rendons public ci-dessous.
                    </p>
                </section>

                {/* Scoring Rubric */}
                <section className="space-y-6">
                    <h3 className="text-xl font-bold uppercase text-white tracking-widest flex items-center gap-2 font-mono">
                        <Scale className="w-5 h-5 text-[#ff6b35]" />
                        Barème de Notation (1.0 - 10.0)
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {/* Low Risk */}
                        <div className="p-6 bg-[#0d1526] border border-[#1a1f2e] rounded-lg relative group hover:border-[#00ff88]/50 transition-colors">
                            <div className="absolute top-0 left-0 w-full h-1 bg-[#00ff88]"></div>
                            <h4 className="text-[#00ff88] font-bold text-lg mb-2">Score 1.0 - 3.9</h4>
                            <span className="text-xs font-mono bg-[#00ff88]/10 text-[#00ff88] px-2 py-1 rounded inline-block mb-4">SITUATION STABLE</span>
                            <ul className="text-sm text-[#8892a0] space-y-2 list-disc pl-4">
                                <li>Aucun conflit armé ou civil.</li>
                                <li>Indicateurs économiques positifs ou stables.</li>
                                <li>Production pétrolière constante.</li>
                                <li>Dialogue diplomatique actif.</li>
                            </ul>
                        </div>

                        {/* Medium Risk */}
                        <div className="p-6 bg-[#0d1526] border border-[#1a1f2e] rounded-lg relative group hover:border-yellow-500/50 transition-colors">
                            <div className="absolute top-0 left-0 w-full h-1 bg-yellow-500"></div>
                            <h4 className="text-yellow-500 font-bold text-lg mb-2">Score 4.0 - 6.9</h4>
                            <span className="text-xs font-mono bg-yellow-500/10 text-yellow-500 px-2 py-1 rounded inline-block mb-4">TENSION ÉLEVÉE</span>
                            <ul className="text-sm text-[#8892a0] space-y-2 list-disc pl-4">
                                <li>Manifestations sporadiques.</li>
                                <li>Sanctions économiques actives.</li>
                                <li>Rétorique politique aggressive.</li>
                                <li>Volatilité des prix du pétrole.</li>
                            </ul>
                        </div>

                        {/* Critical Risk */}
                        <div className="p-6 bg-[#0d1526] border border-[#1a1f2e] rounded-lg relative group hover:border-[#ff3b3b]/50 transition-colors">
                            <div className="absolute top-0 left-0 w-full h-1 bg-[#ff3b3b]"></div>
                            <h4 className="text-[#ff3b3b] font-bold text-lg mb-2">Score 7.0 - 10.0</h4>
                            <span className="text-xs font-mono bg-[#ff3b3b]/10 text-[#ff3b3b] px-2 py-1 rounded inline-block mb-4">CRISE / CONFLIT</span>
                            <ul className="text-sm text-[#8892a0] space-y-2 list-disc pl-4">
                                <li>Affrontements armés ou émeutes généralisées.</li>
                                <li>Rupture diplomatique totale.</li>
                                <li>Effondrement économique ou hyperinflation subite.</li>
                                <li>Arrêt des exportations pétrolières.</li>
                            </ul>
                        </div>
                    </div>
                </section>

                {/* Methodology Detail */}
                <section className="space-y-6">
                    <h3 className="text-xl font-bold uppercase text-white tracking-widest flex items-center gap-2 font-mono">
                        <BookOpen className="w-5 h-5 text-[#00d4ff]" />
                        Protocole d'Analyse
                    </h3>

                    <div className="space-y-4">
                        <div className="glass-card p-6 border-l-4 border-l-[#00d4ff]">
                            <h4 className="font-bold text-white mb-2">1. Collecte Multi-Sources</h4>
                            <p className="text-sm text-[#8892a0]">
                                Nous agrégeons plus de <strong>100 flux RSS</strong> provenant de médias internationaux (Reuters, BBC), régionaux (El Tiempo, O Globo) et locaux (El Nacional, Effecto Cocuyo), incluant toutes les sensibilités politiques (Pro-Gouvernement et Opposition) pour éviter les biais.
                            </p>
                        </div>

                        <div className="glass-card p-6 border-l-4 border-l-[#00ff88]">
                            <h4 className="font-bold text-white mb-2">2. Analyse Sémantique IA</h4>
                            <p className="text-sm text-[#8892a0]">
                                Le modèle Gemini lit et catégorise chaque article. Il détecte les <strong>entités nommées</strong> (Maduro, PDVSA, etc.), le <strong>sentiment</strong> (Positif/Négatif) et la <strong>fiabilité</strong> de la source.
                            </p>
                        </div>

                        <div className="glass-card p-6 border-l-4 border-l-[#ff3b3b]">
                            <h4 className="font-bold text-white mb-2">3. Validation & Citations</h4>
                            <p className="text-sm text-[#8892a0]">
                                Pour qu'une information soit classée comme "Alerte Critique", elle doit être corroborée par au moins <strong>3 sources distinctes</strong> ou provenir d'une source tierce de niveau 1 (Reuters, AFP). L'IA est instruite pour toujours citer ses sources.
                            </p>
                        </div>
                    </div>
                </section>

                {/* FAQ / Ethical Statement */}
                <section className="p-6 bg-[#00d4ff]/5 rounded-xl border border-[#00d4ff]/20">
                    <div className="flex items-start gap-4">
                        <AlertCircle className="w-6 h-6 text-[#00d4ff] shrink-0 mt-1" />
                        <div>
                            <h4 className="font-bold text-[#00d4ff] mb-2 uppercase text-sm tracking-widest">Note sur les Hallucinations IA</h4>
                            <p className="text-sm text-[#8892a0] leading-relaxed">
                                Bien que notre prompt impose une rigueur stricte ("Ne jamais inventer de faits"), les modèles de langage peuvent parfois faire des erreurs.
                                Ce tableau de bord est un outil d'aide à la décision et ne doit pas constituer la source unique pour des décisions critiques de sécurité.
                                Vérifiez toujours les sources primaires via les liens fournis.
                            </p>
                        </div>
                    </div>
                </section>

            </main>

            {/* Footer */}
            <footer className="py-8 border-t border-[#1a1f2e] text-center text-[#4a5568] text-xs font-mono">
                <p>MSIE49 VENEZUELA WATCH // TRANSPARENCY REPORT V1.0</p>
            </footer>
        </div>
    );
}
