"use client";

import React, { useState } from "react";
import { Lock, Globe, ChevronRight } from "lucide-react";

export default function LoginPage() {
    const [password, setPassword] = useState("");
    const [error, setError] = useState(false);

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        // Simplified logic for UI demonstration
        if (password === "VNZ2026") {
            window.location.href = "/";
        } else {
            setError(true);
            setTimeout(() => setError(false), 2000);
        }
    };

    return (
        <div className="min-h-screen bg-[#0a0e17] flex flex-col items-center justify-center p-4 relative overflow-hidden">
            {/* Background Decorative Elements */}
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-[#00d4ff]/5 rounded-full blur-[120px]"></div>
            <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-[#ff6b35]/5 rounded-full blur-[120px]"></div>

            {/* Login Card */}
            <div className="w-full max-w-md glass-card p-8 relative z-10 border-t-2 border-[#00d4ff]/30">
                <div className="flex flex-col items-center mb-8">
                    <div className="w-16 h-16 bg-[#00d4ff]/10 rounded-xl flex items-center justify-center border border-[#00d4ff]/30 mb-4 animate-pulse">
                        <Globe className="w-10 h-10 text-[#00d4ff]" />
                    </div>
                    <h1 className="text-2xl font-bold tracking-tighter terminal-text">VENEZUELA WATCH</h1>
                    <p className="text-[10px] text-[#8892a0] uppercase tracking-widest font-mono mt-1">Strategic Intelligence Gateway</p>
                </div>

                <form onSubmit={handleLogin} className="space-y-6">
                    <div className="space-y-2">
                        <label className="text-[10px] font-mono text-[#8892a0] uppercase tracking-wider ml-1">Code d'accès sécurisé</label>
                        <div className="relative group">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Lock className={`w-4 h-4 transition-colors ${error ? 'text-[#ff3b3b]' : 'text-[#8892a0] group-focus-within:text-[#00d4ff]'}`} />
                            </div>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className={`w-full bg-[#0d1526] border ${error ? 'border-[#ff3b3b] shadow-[0_0_10px_rgba(255,59,59,0.2)]' : 'border-[#1a1f2e] focus:border-[#00d4ff] shadow-inner'} rounded px-10 py-3 text-sm transition-all outline-none terminal-text placeholder:text-[#4a5568]`}
                                placeholder="••••••••••••"
                                required
                            />
                        </div>
                        {error && (
                            <p className="text-[10px] text-[#ff3b3b] font-mono mt-2 animate-bounce flex items-center gap-1 leading-none">
                                <span className="w-1 h-3 bg-[#ff3b3b]"></span> CODE D'ACCÈS INVALIDE. VEUILLEZ RÉESSAYER.
                            </p>
                        )}
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-[#00d4ff] hover:bg-[#00b8e6] text-[#0a0e17] font-bold py-3 rounded flex items-center justify-center gap-2 group transition-all transform active:scale-[0.98] relative overflow-hidden"
                    >
                        <span className="relative z-10 uppercase text-xs tracking-widest flex items-center gap-2">
                            Accéder au Dashboard <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </span>
                        <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-500 skew-x-[-20deg]"></div>
                    </button>
                </form>

                <div className="mt-8 pt-8 border-t border-[#1a1f2e] grid grid-cols-2 gap-4">
                    <div className="text-center">
                        <span className="block text-[8px] text-[#4a5568] uppercase font-mono mb-1">Status Système</span>
                        <span className="text-[9px] text-[#00ff88] font-mono flex items-center justify-center gap-1">
                            <span className="w-1 h-1 rounded-full bg-[#00ff88]"></span> ONLINE
                        </span>
                    </div>
                    <div className="text-center">
                        <span className="block text-[8px] text-[#4a5568] uppercase font-mono mb-1">Sécurité</span>
                        <span className="text-[9px] text-[#00d4ff] font-mono">TLS 1.3 / AES-256</span>
                    </div>
                </div>
            </div>

            <p className="mt-8 text-[10px] text-[#4a5568] font-mono uppercase tracking-[0.2em] animate-pulse">
                Waiting for authentication...
            </p>
        </div>
    );
}
