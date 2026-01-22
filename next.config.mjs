/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    // Force le build même s'il y a des erreurs de dossiers/types
    ignoreBuildErrors: true,
  },
  eslint: {
    // Ignore les avertissements de code pendant la construction
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
