import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const mono = JetBrains_Mono({ subsets: ["latin"], variable: "--font-mono" });

export const metadata: Metadata = {
    title: "VENEZUELA WATCH | Terminal",
    description: "Dashboard de Veille Géopolitique & Économique - Venezuela / OPEP",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="fr" className={`${inter.variable} ${mono.variable}`}>
            <body className="antialiased overflow-x-hidden min-h-screen">
                {children}
            </body>
        </html>
    );
}
