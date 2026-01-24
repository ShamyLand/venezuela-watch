"use client";

import React from 'react';
import { ThumbsUp, Repeat2, MessageCircle, ExternalLink } from 'lucide-react';

interface SocialPost {
    platform: string;
    author: string;
    avatar: string;
    content: string;
    timestamp: string;
    likes: number;
    retweets: number;
    replies: number;
    url: string;
}

// Mock social media posts - 100% FREE, no API needed!
const MOCK_SOCIAL_POSTS: SocialPost[] = [
    {
        platform: "Twitter/X",
        author: "@Reuters",
        avatar: "https://api.dicebear.com/7.x/initials/svg?seed=Reuters&backgroundColor=00acee",
        content: "🇻🇪 Venezuela announces new measures to stabilize oil production amid ongoing sanctions. PDVSA officials report production targets adjusted for Q1 2026.",
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        likes: 1245,
        retweets: 387,
        replies: 156,
        url: "https://twitter.com/Reuters"
    },
    {
        platform: "Twitter/X",
        author: "@BBCWorld",
        avatar: "https://api.dicebear.com/7.x/initials/svg?seed=BBC&backgroundColor=bb1919",
        content: "Breaking: International observers report on Venezuela's economic indicators. Oil exports to China reach new levels this month. #Venezuela #Economy",
        timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
        likes: 892,
        retweets: 234,
        replies: 98,
        url: "https://twitter.com/BBCWorld"
    },
    {
        platform: "Twitter/X",
        author: "@AFP",
        avatar: "https://api.dicebear.com/7.x/initials/svg?seed=AFP&backgroundColor=0088cc",
        content: "🛢️ Venezuela's crude oil production figures for January 2026 show marginal increase. Industry analysts weigh in on sustainability of current trends.",
        timestamp: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(),
        likes: 567,
        retweets: 145,
        replies: 67,
        url: "https://twitter.com/AFP"
    },
    {
        platform: "Twitter/X",
        author: "@AlJazeera",
        avatar: "https://api.dicebear.com/7.x/initials/svg?seed=AlJazeera&backgroundColor=f68b1e",
        content: "Venezuela's diplomatic relations with regional partners under spotlight. New trade agreements being negotiated with several Latin American nations.",
        timestamp: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
        likes: 723,
        retweets: 198,
        replies: 89,
        url: "https://twitter.com/AlJazeera"
    },
    {
        platform: "Twitter/X",
        author: "@guardian",
        avatar: "https://api.dicebear.com/7.x/initials/svg?seed=Guardian&backgroundColor=052962",
        content: "Analysis: Venezuela's economic challenges persist despite global oil price recovery. What this means for regional stability. Read our latest coverage ⬇️",
        timestamp: new Date(Date.now() - 15 * 60 * 60 * 1000).toISOString(),
        likes: 1034,
        retweets: 312,
        replies: 145,
        url: "https://twitter.com/guardian"
    },
    {
        platform: "Twitter/X",
        author: "@France24_en",
        avatar: "https://api.dicebear.com/7.x/initials/svg?seed=France24&backgroundColor=e2001a",
        content: "🇻🇪 Latest from Caracas: Government announces infrastructure investment plan focused on oil sector modernization. Details emerging.",
        timestamp: new Date(Date.now() - 18 * 60 * 60 * 1000).toISOString(),
        likes: 445,
        retweets: 123,
        replies: 56,
        url: "https://twitter.com/France24_en"
    }
];

export default function SocialMediaFeed() {
    const formatTimeAgo = (timestamp: string) => {
        const now = new Date();
        const postDate = new Date(timestamp);
        const hoursDiff = Math.floor((now.getTime() - postDate.getTime()) / (1000 * 60 * 60));

        if (hoursDiff < 1) return "il y a quelques minutes";
        if (hoursDiff === 1) return "il y a 1 heure";
        if (hoursDiff < 24) return `il y a ${hoursDiff}h`;
        const daysDiff = Math.floor(hoursDiff / 24);
        return `il y a ${daysDiff}j`;
    };

    return (
        <>
            <div className="glass-card p-6">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-lg uppercase font-black tracking-widest font-mono flex items-center gap-2">
                        <MessageCircle className="w-5 h-5 text-[#00d4ff]" />
                        Réseaux Sociaux
                    </h2>
                    <div className="text-[10px] text-[#8892a0] font-mono">
                        DERNIERS POSTS VENEZUELA
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {MOCK_SOCIAL_POSTS.map((post, index) => (
                        <div
                            key={index}
                            className="p-4 bg-[#0d1526] border border-[#1a1f2e] rounded-lg hover:border-[#00d4ff]/30 transition-all cursor-pointer group"
                            onClick={() => window.open(post.url, '_blank')}
                        >
                            {/* Header */}
                            <div className="flex items-center gap-3 mb-3">
                                <img
                                    src={post.avatar}
                                    alt={post.author}
                                    className="w-10 h-10 rounded-full border-2 border-[#00d4ff]/20"
                                />
                                <div className="flex-1 min-w-0">
                                    <div className="font-bold text-sm truncate">{post.author}</div>
                                    <div className="text-[10px] text-[#8892a0]">
                                        {formatTimeAgo(post.timestamp)}
                                    </div>
                                </div>
                            </div>

                            {/* Content */}
                            <p className="text-sm text-[#e0e0e0] leading-relaxed mb-3 line-clamp-4">
                                {post.content}
                            </p>

                            {/* Engagement Stats */}
                            <div className="flex items-center gap-4 text-[11px] text-[#8892a0] pt-3 border-t border-[#1a1f2e]">
                                <div className="flex items-center gap-1">
                                    <ThumbsUp className="w-3.5 h-3.5" />
                                    <span>{post.likes.toLocaleString()}</span>
                                </div>
                                <div className="flex items-center gap-1">
                                    <Repeat2 className="w-3.5 h-3.5" />
                                    <span>{post.retweets}</span>
                                </div>
                                <div className="flex items-center gap-1">
                                    <MessageCircle className="w-3.5 h-3.5" />
                                    <span>{post.replies}</span>
                                </div>
                                <div className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity">
                                    <ExternalLink className="w-3.5 h-3.5 text-[#00d4ff]" />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Info Footer */}
                <div className="mt-6 p-3 bg-white/5 rounded-lg border border-white/10 text-center">
                    <p className="text-[10px] text-[#8892a0] font-mono">
                        💡 Posts simulés basés sur des sources d'actualité fiables • Connectez l'API Twitter/X pour des données en temps réel
                    </p>
                </div>
            </div>
        </>
    );
}
