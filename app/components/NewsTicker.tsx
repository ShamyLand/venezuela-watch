"use client";

import React from 'react';
import { AlertTriangle } from 'lucide-react';

interface Alert {
    titre: string;
    description: string;
    niveau: 'CRITIQUE' | 'MOYEN' | 'MINEUR';
    source_citee?: string;
    timestamp?: string;
}

interface NewsTickerProps {
    alerts: Alert[];
}

export default function NewsTicker({ alerts }: NewsTickerProps) {
    // Filter alerts to show only CRITIQUE and MOYEN that are less than 48 hours old
    const recentAlerts = alerts.filter(alert => {
        if (!alert.timestamp) return false;

        const alertDate = new Date(alert.timestamp);
        const now = new Date();
        const hoursDiff = (now.getTime() - alertDate.getTime()) / (1000 * 60 * 60);

        // Only show CRITIQUE or MOYEN alerts within 48 hours
        return hoursDiff <= 48 && (alert.niveau === 'CRITIQUE' || alert.niveau === 'MOYEN');
    });

    // Don't render if no alerts to show
    if (recentAlerts.length === 0) return null;

    // Determine background color based on highest severity
    const hasCritical = recentAlerts.some(a => a.niveau === 'CRITIQUE');
    const bgColor = hasCritical ? 'bg-red-600' : 'bg-orange-600';
    const textColor = 'text-white';

    // Create repeating ticker content
    const tickerContent = recentAlerts.map((alert, i) => (
        <span key={i} className="inline-flex items-center mx-8">
            <AlertTriangle className="w-4 h-4 mr-2 animate-pulse" />
            <span className="font-black uppercase mr-2">ALERTE</span>
            <span className="mx-2">•</span>
            <span className="font-bold">{alert.titre}</span>
            <span className="mx-2">•</span>
        </span>
    ));

    return (
        <div className={`${bgColor} ${textColor} py-2 overflow-hidden relative z-40 border-b-2 border-white/20`}>
            <div className="ticker-wrapper">
                <div className="ticker-content">
                    {/* Repeat content multiple times for seamless loop */}
                    {tickerContent}
                    {tickerContent}
                    {tickerContent}
                </div>
            </div>

            <style jsx>{`
                .ticker-wrapper {
                    width: 100%;
                    overflow: hidden;
                }

                .ticker-content {
                    display: inline-block;
                    white-space: nowrap;
                    animation: ticker 30s linear infinite;
                    will-change: transform;
                }

                .ticker-content:hover {
                    animation-play-state: paused;
                }

                @keyframes ticker {
                    0% {
                        transform: translateX(0);
                    }
                    100% {
                        transform: translateX(-33.333%);
                    }
                }
            `}</style>
        </div>
    );
}
