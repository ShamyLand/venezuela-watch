/** @type {import('next').NextConfig} */
const nextConfig = {
    typescript: {
        // ⚠️ Dangerously allow production builds to successfully complete even if
        // your project has TypeScript errors.
        ignoreBuildErrors: true,
    },
    eslint: {
        // ⚠️ This allows production builds to successfully complete even if
        // your project has ESLint errors.
        ignoreDuringBuilds: true,
    },
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'images.unsplash.com',
            },
        ],
    },
};

export default nextConfig;
