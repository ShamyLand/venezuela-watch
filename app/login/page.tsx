"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Shield, Lock, Eye, EyeOff, AlertCircle } from 'lucide-react';

export default function LoginPage() {
    const router = useRouter();
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const response = await fetch('/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ password })
            });

            const data = await response.json();

            if (data.success) {
                // Redirect to dashboard
                router.push('/dashboard');
                router.refresh();
            } else {
                setError('Mot de passe incorrect');
                setPassword('');
            }
        } catch (err) {
            setError('Erreur de connexion');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#0a0e17] via-[#0d1526] to-[#0a0e17] flex items-center justify-center p-4">
            {/* Background Effects */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#00d4ff]/5 rounded-full blur-3xl"></div>
                <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#00ff88]/5 rounded-full blur-3xl"></div>
            </div>

            {/* Login Card */}
            <div className="relative w-full max-w-md">
                {/* Glow Effect */}
                <div className="absolute -inset-1 bg-gradient-to-r from-[#00d4ff] via-[#00ff88] to-[#00d4ff] rounded-2xl blur-xl opacity-20 group-hover:opacity-30 transition-opacity"></div>

                <div className="relative bg-[#0d1526]/90 backdrop-blur-xl border border-[#00d4ff]/20 rounded-2xl p-8 shadow-2xl">
                    {/* Logo/Header */}
                    <div className="text-center mb-8">
                        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-[#00d4ff] to-[#00ff88] rounded-xl mb-4 shadow-lg shadow-[#00d4ff]/30">
                            <Shield className="w-8 h-8 text-[#0a0e17]" />
                        </div>
                        <h1 className="text-2xl font-black uppercase tracking-wider text-white mb-2">
                            Venezuela Watch
                        </h1>
                        <p className="text-sm text-[#8892a0] font-mono">
                            MSIE49 - Système de Veille Géopolitique
                        </p>
                    </div>

                    {/* Login Form */}
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Password Input */}
                        <div>
                            <label htmlFor="password" className="block text-xs uppercase font-bold text-[#8892a0] mb-2 tracking-wider">
                                <Lock className="w-3 h-3 inline mr-1" />
                                Mot de Passe
                            </label>
                            <div className="relative">
                                <input
                                    id="password"
                                    type={showPassword ? 'text' : 'password'}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full bg-[#0a0e17] border border-[#1a1f2e] rounded-lg px-4 py-3 text-white placeholder-[#4a5568] focus:outline-none focus:border-[#00d4ff] focus:ring-2 focus:ring-[#00d4ff]/20 transition-all"
                                    placeholder="Entrez votre mot de passe"
                                    required
                                    autoFocus
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8892a0] hover:text-[#00d4ff] transition-colors"
                                >
                                    {showPassword ? (
                                        <EyeOff className="w-5 h-5" />
                                    ) : (
                                        <Eye className="w-5 h-5" />
                                    )}
                                </button>
                            </div>
                        </div>

                        {/* Error Message */}
                        {error && (
                            <div className="flex items-center gap-2 p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm">
                                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                                <span>{error}</span>
                            </div>
                        )}

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={loading || !password}
                            className="w-full bg-gradient-to-r from-[#00d4ff] to-[#00ff88] text-[#0a0e17] font-black uppercase tracking-wider py-3 rounded-lg hover:shadow-lg hover:shadow-[#00d4ff]/30 disabled:opacity-50 disabled:cursor-not-allowed transition-all transform hover:scale-[1.02] active:scale-[0.98]"
                        >
                            {loading ? (
                                <span className="flex items-center justify-center gap-2">
                                    <div className="w-5 h-5 border-2 border-[#0a0e17]/30 border-t-[#0a0e17] rounded-full animate-spin"></div>
                                    Connexion...
                                </span>
                            ) : (
                                'Accéder au Dashboard'
                            )}
                        </button>
                    </form>

                    {/* Footer */}
                    <div className="mt-8 pt-6 border-t border-[#1a1f2e] text-center">
                        <p className="text-[10px] text-[#4a5568] font-mono">
                            🔒 Connexion sécurisée • Accès restreint
                        </p>
                    </div>
                </div>
            </div>

            {/* Decorative Elements */}
            <div className="fixed bottom-4 left-1/2 -translate-x-1/2 text-[10px] text-[#4a5568] font-mono">
                MSIE49 © 2026 • Tous droits réservés
            </div>
        </div>
    );
}
