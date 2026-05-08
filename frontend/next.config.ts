import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // Enable React strict mode
  reactStrictMode: true,

  // Skip TypeScript errors during build (matches original Vite project behavior)
  typescript: {
    ignoreBuildErrors: true,
  },

  // Skip ESLint errors during build
  eslint: {
    ignoreDuringBuilds: true,
  },

  // Allow images from external sources
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },

  // Redirect API requests to backend
  async rewrites() {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
    return [
      {
        source: '/api/:path*',
        destination: `${apiUrl}/api/:path*`,
      },
    ];
  },
};

export default nextConfig;
