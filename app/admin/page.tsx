import { supabase } from "@/lib/supabase";
import { RSS_FEEDS } from "@/lib/news-service";

export const dynamic = "force-dynamic";

async function getLatestAnalysis() {
    const { data, error } = await supabase
        .from('analyses')
        .select('*')
        .order('timestamp', { ascending: false })
        .limit(1)
        .single();

    if (error) return null;
    return data;
}

export default async function AdminPage() {
    const analysis = await getLatestAnalysis();

    // Sort sources by reliability
    const sortedSources = [...RSS_FEEDS].sort((a, b) => b.reliability - a.reliability);

    return (
        <div className="min-h-screen bg-slate-950 text-slate-100 p-8 font-mono">
            <header className="mb-8 border-b border-slate-800 pb-4">
                <h1 className="text-3xl font-bold text-amber-500 mb-2">🛡️ VENEZUELA WATCH | ADMIN CENTER</h1>
                <p className="text-slate-400">Transparency & Methodology Control Panel</p>
            </header>

            <main className="grid grid-cols-1 lg:grid-cols-2 gap-8">

                {/* LEFT COLUMN: AI TRANSPARENCY */}
                <section className="space-y-6">
                    <h2 className="text-xl font-bold text-emerald-400 border-l-4 border-emerald-400 pl-3">
                        🧠 TRANSPARENCE IA (Dernière Analyse)
                    </h2>

                    {analysis ? (
                        <div className="bg-slate-900 rounded-lg p-6 border border-slate-800 shadow-xl">
                            <div className="flex justify-between items-center mb-6">
                                <span className="text-sm text-slate-500">
                                    Généré le: {new Date(analysis.timestamp).toLocaleString()}
                                </span>
                                <span className="px-3 py-1 bg-emerald-900 text-emerald-300 text-xs rounded-full">
                                    Statut: VALIDE
                                </span>
                            </div>

                            {/* METHODOLOGIE */}
                            <div className="mb-8">
                                <h3 className="text-lg font-bold text-white mb-3 flex items-center">
                                    <span className="mr-2">📐</span> Méthodologie de Notation
                                </h3>
                                <div className="bg-slate-950 p-4 rounded border border-slate-800 text-sm text-slate-300 space-y-3">
                                    {analysis.transparency_json?.methodology ? (
                                        Object.entries(analysis.transparency_json.methodology).map(([key, value]: any) => (
                                            <div key={key}>
                                                <strong className="text-amber-400 uppercase text-xs">{key.replace('_', ' ')}:</strong>
                                                <p className="mt-1">{value}</p>
                                            </div>
                                        ))
                                    ) : (
                                        <p className="italic text-slate-600">Données de méthodologie non disponibles pour cette analyse.</p>
                                    )}
                                </div>
                            </div>

                            {/* RAISONNEMENT */}
                            <div className="mb-8">
                                <h3 className="text-lg font-bold text-white mb-3 flex items-center">
                                    <span className="mr-2">🤔</span> Raisonnement IA
                                </h3>
                                <div className="bg-slate-950 p-4 rounded border border-slate-800 text-sm text-slate-300">
                                    <p className="leading-relaxed">
                                        {analysis.transparency_json?.ai_reasoning || "Raisonnement non disponible."}
                                    </p>
                                </div>
                            </div>

                            {/* SOURCES CITEES */}
                            <div>
                                <h3 className="text-lg font-bold text-white mb-3 flex items-center">
                                    <span className="mr-2">🔗</span> Sources Citées (Vérifiées)
                                </h3>
                                <div className="space-y-2">
                                    {analysis.transparency_json?.sources_used ? (
                                        analysis.transparency_json.sources_used.map((source: any, idx: number) => (
                                            <div key={idx} className="bg-slate-950 p-3 rounded border-l-2 border-amber-500 text-sm">
                                                <div className="flex justify-between mb-1">
                                                    <strong className="text-white">{source.name}</strong>
                                                    <span className="text-xs text-slate-500">Fiabilité: {source.reliability_score}</span>
                                                </div>
                                                <a href={source.url} target="_blank" className="text-blue-400 hover:underline truncate block mb-1 text-xs">
                                                    {source.url}
                                                </a>
                                                <p className="text-slate-400 text-xs italic">"{source.usage_context}"</p>
                                            </div>
                                        ))
                                    ) : (
                                        <p className="italic text-slate-600">Aucune source spécifique liée.</p>
                                    )}
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="p-8 bg-slate-900 rounded border border-red-900/50 text-red-400 text-center">
                            Aucune analyse trouvée dans la base de données.
                        </div>
                    )}
                </section>

                {/* RIGHT COLUMN: SOURCES MONITOR */}
                <section className="space-y-6">
                    <div className="flex justify-between items-center">
                        <h2 className="text-xl font-bold text-blue-400 border-l-4 border-blue-400 pl-3">
                            📡 SURVEILLANCE DES SOURCES ({sortedSources.length})
                        </h2>
                        <a href="/api/sources" target="_blank" className="text-xs text-slate-500 hover:text-white underline">
                            Voir JSON brut
                        </a>
                    </div>

                    <div className="bg-slate-900 rounded-lg border border-slate-800 max-h-[80vh] overflow-y-auto custom-scrollbar">
                        <table className="w-full text-left text-sm">
                            <thead className="bg-slate-950 sticky top-0">
                                <tr>
                                    <th className="p-3 text-slate-400 font-normal">Source</th>
                                    <th className="p-3 text-slate-400 font-normal">Catégorie</th>
                                    <th className="p-3 text-slate-400 font-normal text-right">Fiabilité</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-800">
                                {sortedSources.map((feed, idx) => (
                                    <tr key={idx} className="hover:bg-slate-800/50 transition-colors">
                                        <td className="p-3">
                                            <div className="font-semibold text-slate-200">{feed.source}</div>
                                            <a href={feed.url} className="text-xs text-slate-600 truncate max-w-[200px] block hover:text-blue-400">
                                                {feed.url}
                                            </a>
                                        </td>
                                        <td className="p-3">
                                            <span className={`px-2 py-1 rounded text-xs border ${feed.category === 'Venezuela' ? 'bg-yellow-900/30 border-yellow-800 text-yellow-500' :
                                                    feed.category === 'International' ? 'bg-blue-900/30 border-blue-800 text-blue-500' :
                                                        feed.category === 'Oil' ? 'bg-red-900/30 border-red-800 text-red-500' :
                                                            'bg-slate-800 border-slate-700 text-slate-400'
                                                }`}>
                                                {feed.category}
                                            </span>
                                        </td>
                                        <td className="p-3 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <div className="w-16 h-1.5 bg-slate-800 rounded-full overflow-hidden">
                                                    <div
                                                        className={`h-full rounded-full ${feed.reliability >= 8 ? 'bg-emerald-500' :
                                                                feed.reliability >= 5 ? 'bg-amber-500' :
                                                                    'bg-red-500'
                                                            }`}
                                                        style={{ width: `${feed.reliability * 10}%` }}
                                                    />
                                                </div>
                                                <span className="text-xs font-mono text-slate-300">{feed.reliability}/10</span>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </section>
            </main>
        </div>
    );
}
