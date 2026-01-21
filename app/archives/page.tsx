"use client";

import React, { useState } from "react";
import {
    ArrowLeft,
    Calendar,
    Search,
    Download,
    ChevronRight,
    Cpu,
    FileText,
    Filter,
    BarChart3,
    Clock
} from "lucide-react";
import Link from "next/link";

const ARCHIVE_MONTHS = ["JANVIER 2026", "DÉCEMBRE 2025", "NOVEMBRE 2025"];
const LOGS_MOCK = [
    { time: "18:00", title: "Hausse mineure du Brent suite aux tensions régionales", type: "Flash", status: "Analyzed" },
    { time: "17:00", title: "Stabilité structurelle OPEP: Analyse approfondie", type: "Report", status: "Analyzed" },
    { time: "16:00", title: "Alerte : Maintenance infrastructure PDVSA", type: "Alerts", status: "Analyzed" },
    { time: "15:00", title: "Réaction des marchés aux déclarations US", type: "Flash", status: "Analyzed" },
    { time: "14:00", title: "Synthèse horaire : Flux exportations ASIE", type: "Report", status: "Analyzed" },
    { time: "13:00", title: "Incertitude sur les licences d'exploitation", type: "Alerts", status: "Analyzed" },
    { time: "12:00", title: "Ouverture des marchés : Focus production locale", type: "Flash", status: "Analyzed" },
];

export default function ArchivesPage() {
    const [selectedDate, setSelectedDate] = useState("21 Janvier 2026");

    return (
        <div className="flex flex-col min-h-screen bg-[#0a0e17] text-[#e8e8e8]">
            {/* Header */}
            <header className="h-14 border-b border-[#1a1f2e] bg-[#0d1526]/80 backdrop-blur-md px-6 flex items-center justify-between sticky top-0 z-50">
                <div className="flex items-center gap-4">
                    <Link href="/" className="p-1.5 hover:bg-[#1a1f2e] rounded transition-colors text-[#8892a0] hover:text-[#00d4ff]">
                        <ArrowLeft className="w-4 h-4" />
                    </Link>
                    <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-[#00d4ff]" />
                        <h1 className="text-sm font-bold tracking-widest uppercase font-mono">Archives du Renseignement</h1>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <button className="flex items-center gap-1.5 px-3 py-1 bg-transparent border border-[#1a1f2e] hover:border-[#00d4ff]/50 rounded text-[10px] font-mono text-[#8892a0] transition-all">
                        <Download className="w-3 h-3" /> EXPORTER (.JSON)
                    </button>
                    <button className="flex items-center gap-1.5 px-3 py-1 bg-[#00d4ff] text-[#0a0e17] font-bold rounded text-[10px] font-mono transition-all">
                        <FileText className="w-3 h-3" /> RAPPORT MENSUEL
                    </button>
                </div>
            </header>

            <div className="flex flex-1 overflow-hidden">
                {/* Sidebar - Date Selection */}
                <aside className="w-64 border-r border-[#1a1f2e] flex flex-col bg-[#0d1526]/30 hidden md:flex">
                    <div className="p-4 border-b border-[#1a1f2e]">
                        <div className="relative">
                            <Search className="absolute left-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#4a5568]" />
                            <input
                                type="text"
                                placeholder="Chercher une date..."
                                className="w-full bg-[#0a0e17] border border-[#1a1f2e] rounded pl-8 pr-2 py-1.5 text-xs outline-none focus:border-[#00d4ff]/30 transition-all font-mono"
                            />
                        </div>
                    </div>
                    <div className="flex-1 overflow-y-auto custom-scrollbar p-2">
                        {ARCHIVE_MONTHS.map((month) => (
                            <div key={month} className="mb-4">
                                <div className="px-3 py-2 text-[10px] font-bold text-[#4a5568] uppercase tracking-tighter">{month}</div>
                                <div className="space-y-1">
                                    {[21, 20, 19, 18, 17].map((day) => (
                                        <button
                                            key={day}
                                            onClick={() => setSelectedDate(`${day} ${month.split(' ')[0]} 2026`)}
                                            className={`w-full text-left px-3 py-2 text-xs rounded transition-colors flex justify-between items-center ${selectedDate.includes(day.toString()) ? 'bg-[#00d4ff]/10 text-[#00d4ff]' : 'hover:bg-[#1a1f2e] text-[#8892a0]'}`}
                                        >
                                            <span>{day} {month.split(' ')[0]}</span>
                                            {selectedDate.includes(day.toString()) && <ChevronRight className="w-3 h-3 text-[#00d4ff]" />}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </aside>

                {/* Content - Analysis List */}
                <main className="flex-1 overflow-y-auto p-6 bg-gradient-to-b from-[#0d1526]/20 to-transparent">
                    <div className="max-w-[1000px] mx-auto">
                        <div className="flex items-end justify-between mb-8 pb-4 border-b border-[#1a1f2e]">
                            <div>
                                <h2 className="text-2xl font-bold terminal-text text-[#00d4ff]">{selectedDate}</h2>
                                <p className="text-xs text-[#8892a0] mt-1 font-mono uppercase tracking-widest">Logs stratégiques horaires générés par Gemini IA</p>
                            </div>
                            <div className="flex gap-2">
                                <button className="p-2 bg-[#1a1f2e] border border-[#1a1f2e] rounded text-[#8892a0] hover:text-[#00ff88] transition-colors shadow">
                                    <Filter className="w-4 h-4" />
                                </button>
                            </div>
                        </div>

                        <div className="space-y-4">
                            {LOGS_MOCK.map((log, i) => (
                                <div
                                    key={i}
                                    className="glass-card group hover:glow-border transition-all cursor-pointer overflow-hidden border-l-2 border-transparent hover:border-[#00d4ff]"
                                >
                                    <div className="p-4 flex items-center gap-6">
                                        <div className="flex flex-col items-center justify-center font-mono w-16 border-r border-[#1a1f2e] py-1">
                                            <span className="text-[10px] text-[#4a5568] uppercase">UTC</span>
                                            <span className="text-lg font-bold text-[#e8e8e8] group-hover:text-[#00d4ff] transition-colors">{log.time}</span>
                                        </div>

                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-3 mb-1">
                                                <span className={`text-[8px] font-bold px-1.5 py-0.5 rounded border ${log.type === 'Flash' ? 'bg-[#00d4ff]/10 text-[#00d4ff] border-[#00d4ff]/20' :
                                                        log.type === 'Report' ? 'bg-[#00ff88]/10 text-[#00ff88] border-[#00ff88]/20' :
                                                            'bg-[#ff6b35]/10 text-[#ff6b35] border-[#ff6b35]/20'
                                                    }`}>
                                                    {log.type.toUpperCase()}
                                                </span>
                                                <div className="flex items-center gap-1 text-[10px] text-[#4a5568] font-mono">
                                                    <Clock className="w-2.5 h-2.5" /> SYNC OK
                                                </div>
                                            </div>
                                            <h3 className="text-sm font-medium text-[#e8e8e8] truncate group-hover:translate-x-1 transition-transform">{log.title}</h3>
                                        </div>

                                        <div className="flex items-center gap-4">
                                            <div className="flex -space-x-1">
                                                <div className="w-6 h-6 rounded-full bg-[#1a1f2e] border border-[#0a0e17] flex items-center justify-center text-[8px] text-[#00d4ff]"><Cpu className="w-3 h-3" /></div>
                                                <div className="w-6 h-6 rounded-full bg-[#1a1f2e] border border-[#0a0e17] flex items-center justify-center text-[8px] text-[#00ff88]"><BarChart3 className="w-3 h-3" /></div>
                                            </div>
                                            <ChevronRight className="w-4 h-4 text-[#4a5568] group-hover:text-[#00d4ff] transition-all" />
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="mt-12 p-8 border border-dashed border-[#1a1f2e] rounded-xl flex flex-col items-center justify-center text-center opacity-40 hover:opacity-100 transition-opacity">
                            <Calendar className="w-12 h-12 text-[#1a1f2e] mb-4" />
                            <p className="text-sm font-mono tracking-widest uppercase">Fin de la période sélectionnée</p>
                            <button className="mt-4 text-[10px] text-[#00d4ff] hover:underline uppercase font-mono tracking-tighter">Charger plus de données anciennes</button>
                        </div>
                    </div>
                </main>
            </div>

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
