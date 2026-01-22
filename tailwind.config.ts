import type { Config } from "tailwindcss";

const config: Config = {
    content: [
        "./pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./components/**/*.{js,ts,jsx,tsx,mdx}",
        "./app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            colors: {
                background: "var(--bg-primary)",
                foreground: "var(--text-primary)",
                primary: "var(--bg-primary)",
                secondary: "var(--bg-secondary)",
                card: "var(--bg-card)",
                accent: {
                    blue: "var(--accent-blue)",
                    green: "var(--accent-green)",
                    orange: "var(--accent-orange)",
                    red: "var(--accent-red)",
                },
                text: {
                    primary: "var(--text-primary)",
                    secondary: "var(--text-secondary)",
                },
            },
            fontFamily: {
                sans: ["var(--font-inter)"],
                mono: ["var(--font-mono)"],
            },
            backgroundImage: {
                "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
                "gradient-conic":
                    "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
            },
        },
    },
    plugins: [],
};
export default config;
