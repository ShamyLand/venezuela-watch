"use client";

import React from 'react';
import { Play, Clock, Eye, ExternalLink } from 'lucide-react';

interface YouTubeVideo {
    id: string;
    title: string;
    channel: string;
    thumbnail: string;
    duration: string;
    views: string;
    publishedAt: string;
    url: string;
}

// Mock YouTube videos - 100% FREE, no API needed!
// These are realistic video examples related to Venezuela crisis
const MOCK_YOUTUBE_VIDEOS: YouTubeVideo[] = [
    {
        id: "1",
        title: "Venezuela Crisis 2026: Latest Economic Analysis and Oil Market Impact",
        channel: "Bloomberg Markets",
        thumbnail: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=400&h=225&fit=crop",
        duration: "12:34",
        views: "156K",
        publishedAt: "2 days ago",
        url: "https://youtube.com/results?search_query=venezuela+crisis+2026"
    },
    {
        id: "2",
        title: "Inside Venezuela: PDVSA Oil Production Update January 2026",
        channel: "Reuters",
        thumbnail: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=400&h=225&fit=crop",
        duration: "8:45",
        views: "89K",
        publishedAt: "3 days ago",
        url: "https://youtube.com/results?search_query=venezuela+oil+production"
    },
    {
        id: "3",
        title: "Venezuela Sanctions Impact: Expert Panel Discussion",
        channel: "Al Jazeera English",
        thumbnail: "https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?w=400&h=225&fit=crop",
        duration: "15:20",
        views: "234K",
        publishedAt: "5 days ago",
        url: "https://youtube.com/results?search_query=venezuela+sanctions"
    },
    {
        id: "4",
        title: "Breaking: Venezuela's Economic Recovery Strategy Explained",
        channel: "France 24 English",
        thumbnail: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=400&h=225&fit=crop",
        duration: "10:15",
        views: "67K",
        publishedAt: "1 week ago",
        url: "https://youtube.com/results?search_query=venezuela+economy"
    },
    {
        id: "5",
        title: "Venezuela-China Oil Trade: What You Need to Know",
        channel: "CGTN America",
        thumbnail: "https://images.unsplash.com/photo-1578496479914-7ef3b0193be3?w=400&h=225&fit=crop",
        duration: "9:30",
        views: "123K",
        publishedAt: "1 week ago",
        url: "https://youtube.com/results?search_query=venezuela+china+oil"
    },
    {
        id: "6",
        title: "Latin America Geopolitics: Venezuela's Regional Impact",
        channel: "BBC News",
        thumbnail: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=400&h=225&fit=crop",
        duration: "13:45",
        views: "198K",
        publishedAt: "2 weeks ago",
        url: "https://youtube.com/results?search_query=venezuela+geopolitics"
    }
];

export default function YouTubeVideos() {
    return (
        <div className="glass-card p-6">
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg uppercase font-black tracking-widest font-mono flex items-center gap-2">
                    <Play className="w-5 h-5 text-red-500" />
                    Vidéos YouTube
                </h2>
                <div className="text-[10px] text-[#8892a0] font-mono">
                    COUVERTURE CRISE VÉNÉZUÉLIENNE
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {MOCK_YOUTUBE_VIDEOS.map((video) => (
                    <div
                        key={video.id}
                        className="group cursor-pointer"
                        onClick={() => window.open(video.url, '_blank')}
                    >
                        {/* Thumbnail */}
                        <div className="relative overflow-hidden rounded-lg mb-3 aspect-video bg-[#1a1f2e]">
                            <img
                                src={video.thumbnail}
                                alt={video.title}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            />

                            {/* Play Overlay */}
                            <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                <div className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center">
                                    <Play className="w-8 h-8 text-white ml-1" fill="white" />
                                </div>
                            </div>

                            {/* Duration Badge */}
                            <div className="absolute bottom-2 right-2 bg-black/80 px-2 py-1 rounded text-[10px] font-bold">
                                {video.duration}
                            </div>
                        </div>

                        {/* Video Info */}
                        <div>
                            <h3 className="text-sm font-semibold leading-snug mb-2 line-clamp-2 group-hover:text-[#00d4ff] transition-colors">
                                {video.title}
                            </h3>

                            <div className="flex items-center gap-2 text-[11px] text-[#8892a0] mb-2">
                                <span className="font-medium">{video.channel}</span>
                            </div>

                            <div className="flex items-center gap-3 text-[10px] text-[#8892a0]">
                                <div className="flex items-center gap-1">
                                    <Eye className="w-3 h-3" />
                                    <span>{video.views} vues</span>
                                </div>
                                <div className="flex items-center gap-1">
                                    <Clock className="w-3 h-3" />
                                    <span>{video.publishedAt}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Search YouTube Link */}
            <div className="mt-6 p-4 bg-[#0d1526] border border-[#1a1f2e] rounded-lg">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-sm font-bold mb-1">📹 Plus de vidéos sur YouTube</p>
                        <p className="text-[11px] text-[#8892a0]">
                            Recherchez "Venezuela crisis 2026" pour les dernières analyses
                        </p>
                    </div>
                    <button
                        onClick={() => window.open('https://youtube.com/results?search_query=venezuela+crisis+2026', '_blank')}
                        className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-bold flex items-center gap-2 transition-colors"
                    >
                        <ExternalLink className="w-4 h-4" />
                        YouTube
                    </button>
                </div>
            </div>

            {/* Info Footer */}
            <div className="mt-4 p-3 bg-white/5 rounded-lg border border-white/10 text-center">
                <p className="text-[10px] text-[#8892a0] font-mono">
                    💡 Vidéos simulées • Connectez l'API YouTube pour des recommandations en temps réel
                </p>
            </div>
        </div>
    );
}
